/**
 * Safe wrapper around Response.json() that throws a descriptive error when the
 * server returns an HTML page (e.g. a 404/500 error page or an auth redirect)
 * instead of the cryptic "Unexpected token '<', "<!DOCTYPE "... is not valid JSON".
 */
export async function safeJson<T = unknown>(res: Response): Promise<T> {
    const ct = res.headers.get("content-type") ?? "";
    if (!ct.includes("application/json")) {
        const preview = await res.text().catch(() => "");
        const snippet = preview.slice(0, 120).replace(/\s+/g, " ").trim();
        throw new Error(
            `Server returned a non-JSON response (${res.status}${res.statusText ? " " + res.statusText : ""})` +
            (snippet ? `: ${snippet}` : "")
        );
    }
    return res.json() as Promise<T>;
}
