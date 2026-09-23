import assert from "node:assert/strict";
import { z } from "zod";
import { chatCompletionSafe } from "../lib/ai/aiGateway";
import { captureAIRun } from "../lib/ai/aiTelemetry";
import { withModelRouting } from "../lib/ai/modelRouting";
import { runStructuredIndexedVerifier, VerifierTechnicalError } from "../lib/ai/structuredVerifier";

async function main() {
  const originalFetch = globalThis.fetch;
  const requests: Record<string, any>[] = [];
  let failing = false, malformedOnce = false;
  globalThis.fetch = async (_url, init) => {
    const body = JSON.parse(String(init?.body));
    requests.push(body);
    if (failing) return new Response(JSON.stringify({ error: { message: "Simulated provider unavailable", type: "server_error" } }), { status: 503, headers: { "content-type": "application/json", "retry-after-ms": "1" } });
    const content = malformedOnce ? "{" : JSON.stringify({ assessments: [{ index: 0, score: 80 }] });
    malformedOnce = false;
    return new Response(JSON.stringify({ id: "test", object: "chat.completion", created: 0, model: body.model,
      choices: [{ index: 0, finish_reason: "stop", message: { role: "assistant", content } }],
      usage: { prompt_tokens: 100, completion_tokens: 30, total_tokens: 130, prompt_tokens_details: { cached_tokens: 20 } },
    }), { headers: { "content-type": "application/json" } });
  };
  try {
    const params = { model: "legacy-preserved", temperature: 0.05, max_tokens: 1000, messages: [{ role: "user" as const, content: "secret prompt sentinel" }], response_format: { type: "json_object" as const } };
    await withModelRouting("CONTROL", () => chatCompletionSafe({ ...params, aiTask: { taskType: "SEMANTIC_VERIFICATION" } }));
    assert.deepEqual(requests[0], params, "Rollback preserves the complete API payload");
    const rowSchema = z.object({ index: z.number().int(), score: z.number() }).strict();
    const verify = () => runStructuredIndexedVerifier({ model: "legacy", taskType: "SEMANTIC_VERIFICATION", prompt: "secret prompt sentinel", rowSchema,
      outputKey: "assessments", expectedCount: 1, expectedSchema: "indexed scores", label: "Mock semantic verifier" });
    const run = await captureAIRun(() => withModelRouting("BALANCED_FIRST", verify));
    const request = requests[1];
    assert.equal(request.model, "o3-2025-04-16");
    assert.equal(request.temperature, undefined);
    assert.equal(request.max_tokens, undefined);
    assert.equal(request.max_completion_tokens, 11392);
    assert.equal(request.reasoning_effort, "medium");
    assert.equal(request.response_format.type, "json_schema");
    assert.equal(request.response_format.json_schema.strict, true);
    assert.equal(request.aiTask, undefined);
    assert.equal(run.calls[0].retryCount, 0);
    assert.equal(run.calls[0].cachedInputTokens, 20);
    assert.equal(JSON.stringify(run.calls).includes("secret prompt sentinel"), false);
    malformedOnce = true;
    const repaired = await captureAIRun(() => withModelRouting("BALANCED_FIRST", verify));
    assert.equal(repaired.result.formatRepairAttempts, 1);
    assert.equal(repaired.summary.repairAttempts, 1);
    assert.equal(repaired.calls.length, 2);
    assert.equal(repaired.calls[0].success, false);
    assert.equal(repaired.summary.verifierStructuralFailures, 1);
    failing = true;
    const before = requests.length;
    await assert.rejects(() => withModelRouting("BALANCED_FIRST", verify), (error: unknown) => error instanceof VerifierTechnicalError && error.code === "VERIFIER_API_FAILED");
    assert.equal(requests.length - before, 3, "Existing SDK policy permits initial request and two technical retries");
    assert.ok(requests.slice(before).every(row => row.model === "o3-2025-04-16"), "No silent verifier downgrade");
    failing = false;
    const savedFlag = process.env.AI_MODEL_ROUTING_ENABLED;
    const savedModel = process.env.AI_MODEL_REASONING;
    try {
      process.env.AI_MODEL_REASONING = "unsupported-model-must-not-be-resolved";
      for (const flag of ["false", undefined]) {
        if (flag === undefined) delete process.env.AI_MODEL_ROUTING_ENABLED;
        else process.env.AI_MODEL_ROUTING_ENABLED = flag;
        for (const taskType of ["PROFILE_REASONING", "SLOGAN_GENERATION", "SEMANTIC_VERIFICATION", "EXPRESSION_VERIFICATION", "RECOVERY"] as const) {
          await chatCompletionSafe({ ...params, aiTask: { taskType, complexity: { primaryAttemptFailed: true, isCompound: true, compositionConfidence: 0.1 } } });
          assert.deepEqual(requests.at(-1), params, `Disabled flag preserves ${taskType} despite escalation signals`);
        }
      }
    } finally {
      if (savedFlag === undefined) delete process.env.AI_MODEL_ROUTING_ENABLED; else process.env.AI_MODEL_ROUTING_ENABLED = savedFlag;
      if (savedModel === undefined) delete process.env.AI_MODEL_REASONING; else process.env.AI_MODEL_REASONING = savedModel;
    }
    console.log("MODEL GATEWAY: PASS");
  } finally { globalThis.fetch = originalFetch; }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
