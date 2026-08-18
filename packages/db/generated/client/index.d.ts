
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Account
 * 
 */
export type Account = $Result.DefaultSelection<Prisma.$AccountPayload>
/**
 * Model Session
 * 
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>
/**
 * Model VerificationToken
 * 
 */
export type VerificationToken = $Result.DefaultSelection<Prisma.$VerificationTokenPayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Workspace
 * 
 */
export type Workspace = $Result.DefaultSelection<Prisma.$WorkspacePayload>
/**
 * Model WorkspaceMember
 * 
 */
export type WorkspaceMember = $Result.DefaultSelection<Prisma.$WorkspaceMemberPayload>
/**
 * Model Project
 * 
 */
export type Project = $Result.DefaultSelection<Prisma.$ProjectPayload>
/**
 * Model Niche
 * 
 */
export type Niche = $Result.DefaultSelection<Prisma.$NichePayload>
/**
 * Model Subscription
 * 
 */
export type Subscription = $Result.DefaultSelection<Prisma.$SubscriptionPayload>
/**
 * Model UsageMetric
 * 
 */
export type UsageMetric = $Result.DefaultSelection<Prisma.$UsageMetricPayload>
/**
 * Model AutopilotJob
 * 
 */
export type AutopilotJob = $Result.DefaultSelection<Prisma.$AutopilotJobPayload>
/**
 * Model SignalSnapshot
 * 
 */
export type SignalSnapshot = $Result.DefaultSelection<Prisma.$SignalSnapshotPayload>
/**
 * Model SignalSourceHealth
 * 
 */
export type SignalSourceHealth = $Result.DefaultSelection<Prisma.$SignalSourceHealthPayload>
/**
 * Model MerchOutcomeFeedback
 * 
 */
export type MerchOutcomeFeedback = $Result.DefaultSelection<Prisma.$MerchOutcomeFeedbackPayload>
/**
 * Model SloganPattern
 * 
 */
export type SloganPattern = $Result.DefaultSelection<Prisma.$SloganPatternPayload>
/**
 * Model MarketSignal
 * 
 */
export type MarketSignal = $Result.DefaultSelection<Prisma.$MarketSignalPayload>
/**
 * Model ListingQueue
 * 
 */
export type ListingQueue = $Result.DefaultSelection<Prisma.$ListingQueuePayload>
/**
 * Model ListingPerformance
 * 
 */
export type ListingPerformance = $Result.DefaultSelection<Prisma.$ListingPerformancePayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Accounts
 * const accounts = await prisma.account.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Accounts
   * const accounts = await prisma.account.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.account`: Exposes CRUD operations for the **Account** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.account.findMany()
    * ```
    */
  get account(): Prisma.AccountDelegate<ExtArgs>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate<ExtArgs>;

  /**
   * `prisma.verificationToken`: Exposes CRUD operations for the **VerificationToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VerificationTokens
    * const verificationTokens = await prisma.verificationToken.findMany()
    * ```
    */
  get verificationToken(): Prisma.VerificationTokenDelegate<ExtArgs>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.workspace`: Exposes CRUD operations for the **Workspace** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Workspaces
    * const workspaces = await prisma.workspace.findMany()
    * ```
    */
  get workspace(): Prisma.WorkspaceDelegate<ExtArgs>;

  /**
   * `prisma.workspaceMember`: Exposes CRUD operations for the **WorkspaceMember** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WorkspaceMembers
    * const workspaceMembers = await prisma.workspaceMember.findMany()
    * ```
    */
  get workspaceMember(): Prisma.WorkspaceMemberDelegate<ExtArgs>;

  /**
   * `prisma.project`: Exposes CRUD operations for the **Project** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Projects
    * const projects = await prisma.project.findMany()
    * ```
    */
  get project(): Prisma.ProjectDelegate<ExtArgs>;

  /**
   * `prisma.niche`: Exposes CRUD operations for the **Niche** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Niches
    * const niches = await prisma.niche.findMany()
    * ```
    */
  get niche(): Prisma.NicheDelegate<ExtArgs>;

  /**
   * `prisma.subscription`: Exposes CRUD operations for the **Subscription** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Subscriptions
    * const subscriptions = await prisma.subscription.findMany()
    * ```
    */
  get subscription(): Prisma.SubscriptionDelegate<ExtArgs>;

  /**
   * `prisma.usageMetric`: Exposes CRUD operations for the **UsageMetric** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UsageMetrics
    * const usageMetrics = await prisma.usageMetric.findMany()
    * ```
    */
  get usageMetric(): Prisma.UsageMetricDelegate<ExtArgs>;

  /**
   * `prisma.autopilotJob`: Exposes CRUD operations for the **AutopilotJob** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AutopilotJobs
    * const autopilotJobs = await prisma.autopilotJob.findMany()
    * ```
    */
  get autopilotJob(): Prisma.AutopilotJobDelegate<ExtArgs>;

  /**
   * `prisma.signalSnapshot`: Exposes CRUD operations for the **SignalSnapshot** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SignalSnapshots
    * const signalSnapshots = await prisma.signalSnapshot.findMany()
    * ```
    */
  get signalSnapshot(): Prisma.SignalSnapshotDelegate<ExtArgs>;

  /**
   * `prisma.signalSourceHealth`: Exposes CRUD operations for the **SignalSourceHealth** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SignalSourceHealths
    * const signalSourceHealths = await prisma.signalSourceHealth.findMany()
    * ```
    */
  get signalSourceHealth(): Prisma.SignalSourceHealthDelegate<ExtArgs>;

  /**
   * `prisma.merchOutcomeFeedback`: Exposes CRUD operations for the **MerchOutcomeFeedback** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MerchOutcomeFeedbacks
    * const merchOutcomeFeedbacks = await prisma.merchOutcomeFeedback.findMany()
    * ```
    */
  get merchOutcomeFeedback(): Prisma.MerchOutcomeFeedbackDelegate<ExtArgs>;

  /**
   * `prisma.sloganPattern`: Exposes CRUD operations for the **SloganPattern** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SloganPatterns
    * const sloganPatterns = await prisma.sloganPattern.findMany()
    * ```
    */
  get sloganPattern(): Prisma.SloganPatternDelegate<ExtArgs>;

  /**
   * `prisma.marketSignal`: Exposes CRUD operations for the **MarketSignal** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MarketSignals
    * const marketSignals = await prisma.marketSignal.findMany()
    * ```
    */
  get marketSignal(): Prisma.MarketSignalDelegate<ExtArgs>;

  /**
   * `prisma.listingQueue`: Exposes CRUD operations for the **ListingQueue** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ListingQueues
    * const listingQueues = await prisma.listingQueue.findMany()
    * ```
    */
  get listingQueue(): Prisma.ListingQueueDelegate<ExtArgs>;

  /**
   * `prisma.listingPerformance`: Exposes CRUD operations for the **ListingPerformance** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ListingPerformances
    * const listingPerformances = await prisma.listingPerformance.findMany()
    * ```
    */
  get listingPerformance(): Prisma.ListingPerformanceDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Account: 'Account',
    Session: 'Session',
    VerificationToken: 'VerificationToken',
    User: 'User',
    Workspace: 'Workspace',
    WorkspaceMember: 'WorkspaceMember',
    Project: 'Project',
    Niche: 'Niche',
    Subscription: 'Subscription',
    UsageMetric: 'UsageMetric',
    AutopilotJob: 'AutopilotJob',
    SignalSnapshot: 'SignalSnapshot',
    SignalSourceHealth: 'SignalSourceHealth',
    MerchOutcomeFeedback: 'MerchOutcomeFeedback',
    SloganPattern: 'SloganPattern',
    MarketSignal: 'MarketSignal',
    ListingQueue: 'ListingQueue',
    ListingPerformance: 'ListingPerformance'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "account" | "session" | "verificationToken" | "user" | "workspace" | "workspaceMember" | "project" | "niche" | "subscription" | "usageMetric" | "autopilotJob" | "signalSnapshot" | "signalSourceHealth" | "merchOutcomeFeedback" | "sloganPattern" | "marketSignal" | "listingQueue" | "listingPerformance"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Account: {
        payload: Prisma.$AccountPayload<ExtArgs>
        fields: Prisma.AccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findFirst: {
            args: Prisma.AccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findMany: {
            args: Prisma.AccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          create: {
            args: Prisma.AccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          createMany: {
            args: Prisma.AccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          delete: {
            args: Prisma.AccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          update: {
            args: Prisma.AccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          deleteMany: {
            args: Prisma.AccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          aggregate: {
            args: Prisma.AccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccount>
          }
          groupBy: {
            args: Prisma.AccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccountCountArgs<ExtArgs>
            result: $Utils.Optional<AccountCountAggregateOutputType> | number
          }
        }
      }
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>
        fields: Prisma.SessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession>
          }
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>
            result: $Utils.Optional<SessionCountAggregateOutputType> | number
          }
        }
      }
      VerificationToken: {
        payload: Prisma.$VerificationTokenPayload<ExtArgs>
        fields: Prisma.VerificationTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VerificationTokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VerificationTokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          findFirst: {
            args: Prisma.VerificationTokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VerificationTokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          findMany: {
            args: Prisma.VerificationTokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>[]
          }
          create: {
            args: Prisma.VerificationTokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          createMany: {
            args: Prisma.VerificationTokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VerificationTokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>[]
          }
          delete: {
            args: Prisma.VerificationTokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          update: {
            args: Prisma.VerificationTokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          deleteMany: {
            args: Prisma.VerificationTokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VerificationTokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.VerificationTokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          aggregate: {
            args: Prisma.VerificationTokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVerificationToken>
          }
          groupBy: {
            args: Prisma.VerificationTokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<VerificationTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.VerificationTokenCountArgs<ExtArgs>
            result: $Utils.Optional<VerificationTokenCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Workspace: {
        payload: Prisma.$WorkspacePayload<ExtArgs>
        fields: Prisma.WorkspaceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WorkspaceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WorkspaceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>
          }
          findFirst: {
            args: Prisma.WorkspaceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WorkspaceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>
          }
          findMany: {
            args: Prisma.WorkspaceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>[]
          }
          create: {
            args: Prisma.WorkspaceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>
          }
          createMany: {
            args: Prisma.WorkspaceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WorkspaceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>[]
          }
          delete: {
            args: Prisma.WorkspaceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>
          }
          update: {
            args: Prisma.WorkspaceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>
          }
          deleteMany: {
            args: Prisma.WorkspaceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WorkspaceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.WorkspaceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>
          }
          aggregate: {
            args: Prisma.WorkspaceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWorkspace>
          }
          groupBy: {
            args: Prisma.WorkspaceGroupByArgs<ExtArgs>
            result: $Utils.Optional<WorkspaceGroupByOutputType>[]
          }
          count: {
            args: Prisma.WorkspaceCountArgs<ExtArgs>
            result: $Utils.Optional<WorkspaceCountAggregateOutputType> | number
          }
        }
      }
      WorkspaceMember: {
        payload: Prisma.$WorkspaceMemberPayload<ExtArgs>
        fields: Prisma.WorkspaceMemberFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WorkspaceMemberFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceMemberPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WorkspaceMemberFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceMemberPayload>
          }
          findFirst: {
            args: Prisma.WorkspaceMemberFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceMemberPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WorkspaceMemberFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceMemberPayload>
          }
          findMany: {
            args: Prisma.WorkspaceMemberFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceMemberPayload>[]
          }
          create: {
            args: Prisma.WorkspaceMemberCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceMemberPayload>
          }
          createMany: {
            args: Prisma.WorkspaceMemberCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WorkspaceMemberCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceMemberPayload>[]
          }
          delete: {
            args: Prisma.WorkspaceMemberDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceMemberPayload>
          }
          update: {
            args: Prisma.WorkspaceMemberUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceMemberPayload>
          }
          deleteMany: {
            args: Prisma.WorkspaceMemberDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WorkspaceMemberUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.WorkspaceMemberUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceMemberPayload>
          }
          aggregate: {
            args: Prisma.WorkspaceMemberAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWorkspaceMember>
          }
          groupBy: {
            args: Prisma.WorkspaceMemberGroupByArgs<ExtArgs>
            result: $Utils.Optional<WorkspaceMemberGroupByOutputType>[]
          }
          count: {
            args: Prisma.WorkspaceMemberCountArgs<ExtArgs>
            result: $Utils.Optional<WorkspaceMemberCountAggregateOutputType> | number
          }
        }
      }
      Project: {
        payload: Prisma.$ProjectPayload<ExtArgs>
        fields: Prisma.ProjectFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findFirst: {
            args: Prisma.ProjectFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findMany: {
            args: Prisma.ProjectFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          create: {
            args: Prisma.ProjectCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          createMany: {
            args: Prisma.ProjectCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          delete: {
            args: Prisma.ProjectDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          update: {
            args: Prisma.ProjectUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          deleteMany: {
            args: Prisma.ProjectDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProjectUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          aggregate: {
            args: Prisma.ProjectAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProject>
          }
          groupBy: {
            args: Prisma.ProjectGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectCountAggregateOutputType> | number
          }
        }
      }
      Niche: {
        payload: Prisma.$NichePayload<ExtArgs>
        fields: Prisma.NicheFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NicheFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NichePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NicheFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NichePayload>
          }
          findFirst: {
            args: Prisma.NicheFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NichePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NicheFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NichePayload>
          }
          findMany: {
            args: Prisma.NicheFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NichePayload>[]
          }
          create: {
            args: Prisma.NicheCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NichePayload>
          }
          createMany: {
            args: Prisma.NicheCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NicheCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NichePayload>[]
          }
          delete: {
            args: Prisma.NicheDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NichePayload>
          }
          update: {
            args: Prisma.NicheUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NichePayload>
          }
          deleteMany: {
            args: Prisma.NicheDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NicheUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.NicheUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NichePayload>
          }
          aggregate: {
            args: Prisma.NicheAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNiche>
          }
          groupBy: {
            args: Prisma.NicheGroupByArgs<ExtArgs>
            result: $Utils.Optional<NicheGroupByOutputType>[]
          }
          count: {
            args: Prisma.NicheCountArgs<ExtArgs>
            result: $Utils.Optional<NicheCountAggregateOutputType> | number
          }
        }
      }
      Subscription: {
        payload: Prisma.$SubscriptionPayload<ExtArgs>
        fields: Prisma.SubscriptionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SubscriptionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SubscriptionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          findFirst: {
            args: Prisma.SubscriptionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SubscriptionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          findMany: {
            args: Prisma.SubscriptionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>[]
          }
          create: {
            args: Prisma.SubscriptionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          createMany: {
            args: Prisma.SubscriptionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SubscriptionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>[]
          }
          delete: {
            args: Prisma.SubscriptionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          update: {
            args: Prisma.SubscriptionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          deleteMany: {
            args: Prisma.SubscriptionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SubscriptionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SubscriptionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          aggregate: {
            args: Prisma.SubscriptionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSubscription>
          }
          groupBy: {
            args: Prisma.SubscriptionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SubscriptionCountArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionCountAggregateOutputType> | number
          }
        }
      }
      UsageMetric: {
        payload: Prisma.$UsageMetricPayload<ExtArgs>
        fields: Prisma.UsageMetricFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UsageMetricFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageMetricPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UsageMetricFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageMetricPayload>
          }
          findFirst: {
            args: Prisma.UsageMetricFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageMetricPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UsageMetricFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageMetricPayload>
          }
          findMany: {
            args: Prisma.UsageMetricFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageMetricPayload>[]
          }
          create: {
            args: Prisma.UsageMetricCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageMetricPayload>
          }
          createMany: {
            args: Prisma.UsageMetricCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UsageMetricCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageMetricPayload>[]
          }
          delete: {
            args: Prisma.UsageMetricDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageMetricPayload>
          }
          update: {
            args: Prisma.UsageMetricUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageMetricPayload>
          }
          deleteMany: {
            args: Prisma.UsageMetricDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UsageMetricUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UsageMetricUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageMetricPayload>
          }
          aggregate: {
            args: Prisma.UsageMetricAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUsageMetric>
          }
          groupBy: {
            args: Prisma.UsageMetricGroupByArgs<ExtArgs>
            result: $Utils.Optional<UsageMetricGroupByOutputType>[]
          }
          count: {
            args: Prisma.UsageMetricCountArgs<ExtArgs>
            result: $Utils.Optional<UsageMetricCountAggregateOutputType> | number
          }
        }
      }
      AutopilotJob: {
        payload: Prisma.$AutopilotJobPayload<ExtArgs>
        fields: Prisma.AutopilotJobFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AutopilotJobFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AutopilotJobPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AutopilotJobFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AutopilotJobPayload>
          }
          findFirst: {
            args: Prisma.AutopilotJobFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AutopilotJobPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AutopilotJobFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AutopilotJobPayload>
          }
          findMany: {
            args: Prisma.AutopilotJobFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AutopilotJobPayload>[]
          }
          create: {
            args: Prisma.AutopilotJobCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AutopilotJobPayload>
          }
          createMany: {
            args: Prisma.AutopilotJobCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AutopilotJobCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AutopilotJobPayload>[]
          }
          delete: {
            args: Prisma.AutopilotJobDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AutopilotJobPayload>
          }
          update: {
            args: Prisma.AutopilotJobUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AutopilotJobPayload>
          }
          deleteMany: {
            args: Prisma.AutopilotJobDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AutopilotJobUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AutopilotJobUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AutopilotJobPayload>
          }
          aggregate: {
            args: Prisma.AutopilotJobAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAutopilotJob>
          }
          groupBy: {
            args: Prisma.AutopilotJobGroupByArgs<ExtArgs>
            result: $Utils.Optional<AutopilotJobGroupByOutputType>[]
          }
          count: {
            args: Prisma.AutopilotJobCountArgs<ExtArgs>
            result: $Utils.Optional<AutopilotJobCountAggregateOutputType> | number
          }
        }
      }
      SignalSnapshot: {
        payload: Prisma.$SignalSnapshotPayload<ExtArgs>
        fields: Prisma.SignalSnapshotFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SignalSnapshotFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignalSnapshotPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SignalSnapshotFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignalSnapshotPayload>
          }
          findFirst: {
            args: Prisma.SignalSnapshotFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignalSnapshotPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SignalSnapshotFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignalSnapshotPayload>
          }
          findMany: {
            args: Prisma.SignalSnapshotFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignalSnapshotPayload>[]
          }
          create: {
            args: Prisma.SignalSnapshotCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignalSnapshotPayload>
          }
          createMany: {
            args: Prisma.SignalSnapshotCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SignalSnapshotCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignalSnapshotPayload>[]
          }
          delete: {
            args: Prisma.SignalSnapshotDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignalSnapshotPayload>
          }
          update: {
            args: Prisma.SignalSnapshotUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignalSnapshotPayload>
          }
          deleteMany: {
            args: Prisma.SignalSnapshotDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SignalSnapshotUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SignalSnapshotUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignalSnapshotPayload>
          }
          aggregate: {
            args: Prisma.SignalSnapshotAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSignalSnapshot>
          }
          groupBy: {
            args: Prisma.SignalSnapshotGroupByArgs<ExtArgs>
            result: $Utils.Optional<SignalSnapshotGroupByOutputType>[]
          }
          count: {
            args: Prisma.SignalSnapshotCountArgs<ExtArgs>
            result: $Utils.Optional<SignalSnapshotCountAggregateOutputType> | number
          }
        }
      }
      SignalSourceHealth: {
        payload: Prisma.$SignalSourceHealthPayload<ExtArgs>
        fields: Prisma.SignalSourceHealthFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SignalSourceHealthFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignalSourceHealthPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SignalSourceHealthFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignalSourceHealthPayload>
          }
          findFirst: {
            args: Prisma.SignalSourceHealthFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignalSourceHealthPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SignalSourceHealthFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignalSourceHealthPayload>
          }
          findMany: {
            args: Prisma.SignalSourceHealthFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignalSourceHealthPayload>[]
          }
          create: {
            args: Prisma.SignalSourceHealthCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignalSourceHealthPayload>
          }
          createMany: {
            args: Prisma.SignalSourceHealthCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SignalSourceHealthCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignalSourceHealthPayload>[]
          }
          delete: {
            args: Prisma.SignalSourceHealthDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignalSourceHealthPayload>
          }
          update: {
            args: Prisma.SignalSourceHealthUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignalSourceHealthPayload>
          }
          deleteMany: {
            args: Prisma.SignalSourceHealthDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SignalSourceHealthUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SignalSourceHealthUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SignalSourceHealthPayload>
          }
          aggregate: {
            args: Prisma.SignalSourceHealthAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSignalSourceHealth>
          }
          groupBy: {
            args: Prisma.SignalSourceHealthGroupByArgs<ExtArgs>
            result: $Utils.Optional<SignalSourceHealthGroupByOutputType>[]
          }
          count: {
            args: Prisma.SignalSourceHealthCountArgs<ExtArgs>
            result: $Utils.Optional<SignalSourceHealthCountAggregateOutputType> | number
          }
        }
      }
      MerchOutcomeFeedback: {
        payload: Prisma.$MerchOutcomeFeedbackPayload<ExtArgs>
        fields: Prisma.MerchOutcomeFeedbackFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MerchOutcomeFeedbackFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchOutcomeFeedbackPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MerchOutcomeFeedbackFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchOutcomeFeedbackPayload>
          }
          findFirst: {
            args: Prisma.MerchOutcomeFeedbackFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchOutcomeFeedbackPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MerchOutcomeFeedbackFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchOutcomeFeedbackPayload>
          }
          findMany: {
            args: Prisma.MerchOutcomeFeedbackFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchOutcomeFeedbackPayload>[]
          }
          create: {
            args: Prisma.MerchOutcomeFeedbackCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchOutcomeFeedbackPayload>
          }
          createMany: {
            args: Prisma.MerchOutcomeFeedbackCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MerchOutcomeFeedbackCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchOutcomeFeedbackPayload>[]
          }
          delete: {
            args: Prisma.MerchOutcomeFeedbackDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchOutcomeFeedbackPayload>
          }
          update: {
            args: Prisma.MerchOutcomeFeedbackUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchOutcomeFeedbackPayload>
          }
          deleteMany: {
            args: Prisma.MerchOutcomeFeedbackDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MerchOutcomeFeedbackUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MerchOutcomeFeedbackUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchOutcomeFeedbackPayload>
          }
          aggregate: {
            args: Prisma.MerchOutcomeFeedbackAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMerchOutcomeFeedback>
          }
          groupBy: {
            args: Prisma.MerchOutcomeFeedbackGroupByArgs<ExtArgs>
            result: $Utils.Optional<MerchOutcomeFeedbackGroupByOutputType>[]
          }
          count: {
            args: Prisma.MerchOutcomeFeedbackCountArgs<ExtArgs>
            result: $Utils.Optional<MerchOutcomeFeedbackCountAggregateOutputType> | number
          }
        }
      }
      SloganPattern: {
        payload: Prisma.$SloganPatternPayload<ExtArgs>
        fields: Prisma.SloganPatternFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SloganPatternFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SloganPatternPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SloganPatternFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SloganPatternPayload>
          }
          findFirst: {
            args: Prisma.SloganPatternFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SloganPatternPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SloganPatternFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SloganPatternPayload>
          }
          findMany: {
            args: Prisma.SloganPatternFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SloganPatternPayload>[]
          }
          create: {
            args: Prisma.SloganPatternCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SloganPatternPayload>
          }
          createMany: {
            args: Prisma.SloganPatternCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SloganPatternCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SloganPatternPayload>[]
          }
          delete: {
            args: Prisma.SloganPatternDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SloganPatternPayload>
          }
          update: {
            args: Prisma.SloganPatternUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SloganPatternPayload>
          }
          deleteMany: {
            args: Prisma.SloganPatternDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SloganPatternUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SloganPatternUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SloganPatternPayload>
          }
          aggregate: {
            args: Prisma.SloganPatternAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSloganPattern>
          }
          groupBy: {
            args: Prisma.SloganPatternGroupByArgs<ExtArgs>
            result: $Utils.Optional<SloganPatternGroupByOutputType>[]
          }
          count: {
            args: Prisma.SloganPatternCountArgs<ExtArgs>
            result: $Utils.Optional<SloganPatternCountAggregateOutputType> | number
          }
        }
      }
      MarketSignal: {
        payload: Prisma.$MarketSignalPayload<ExtArgs>
        fields: Prisma.MarketSignalFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MarketSignalFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketSignalPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MarketSignalFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketSignalPayload>
          }
          findFirst: {
            args: Prisma.MarketSignalFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketSignalPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MarketSignalFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketSignalPayload>
          }
          findMany: {
            args: Prisma.MarketSignalFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketSignalPayload>[]
          }
          create: {
            args: Prisma.MarketSignalCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketSignalPayload>
          }
          createMany: {
            args: Prisma.MarketSignalCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MarketSignalCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketSignalPayload>[]
          }
          delete: {
            args: Prisma.MarketSignalDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketSignalPayload>
          }
          update: {
            args: Prisma.MarketSignalUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketSignalPayload>
          }
          deleteMany: {
            args: Prisma.MarketSignalDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MarketSignalUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MarketSignalUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketSignalPayload>
          }
          aggregate: {
            args: Prisma.MarketSignalAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMarketSignal>
          }
          groupBy: {
            args: Prisma.MarketSignalGroupByArgs<ExtArgs>
            result: $Utils.Optional<MarketSignalGroupByOutputType>[]
          }
          count: {
            args: Prisma.MarketSignalCountArgs<ExtArgs>
            result: $Utils.Optional<MarketSignalCountAggregateOutputType> | number
          }
        }
      }
      ListingQueue: {
        payload: Prisma.$ListingQueuePayload<ExtArgs>
        fields: Prisma.ListingQueueFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ListingQueueFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingQueuePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ListingQueueFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingQueuePayload>
          }
          findFirst: {
            args: Prisma.ListingQueueFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingQueuePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ListingQueueFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingQueuePayload>
          }
          findMany: {
            args: Prisma.ListingQueueFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingQueuePayload>[]
          }
          create: {
            args: Prisma.ListingQueueCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingQueuePayload>
          }
          createMany: {
            args: Prisma.ListingQueueCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ListingQueueCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingQueuePayload>[]
          }
          delete: {
            args: Prisma.ListingQueueDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingQueuePayload>
          }
          update: {
            args: Prisma.ListingQueueUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingQueuePayload>
          }
          deleteMany: {
            args: Prisma.ListingQueueDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ListingQueueUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ListingQueueUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingQueuePayload>
          }
          aggregate: {
            args: Prisma.ListingQueueAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateListingQueue>
          }
          groupBy: {
            args: Prisma.ListingQueueGroupByArgs<ExtArgs>
            result: $Utils.Optional<ListingQueueGroupByOutputType>[]
          }
          count: {
            args: Prisma.ListingQueueCountArgs<ExtArgs>
            result: $Utils.Optional<ListingQueueCountAggregateOutputType> | number
          }
        }
      }
      ListingPerformance: {
        payload: Prisma.$ListingPerformancePayload<ExtArgs>
        fields: Prisma.ListingPerformanceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ListingPerformanceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingPerformancePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ListingPerformanceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingPerformancePayload>
          }
          findFirst: {
            args: Prisma.ListingPerformanceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingPerformancePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ListingPerformanceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingPerformancePayload>
          }
          findMany: {
            args: Prisma.ListingPerformanceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingPerformancePayload>[]
          }
          create: {
            args: Prisma.ListingPerformanceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingPerformancePayload>
          }
          createMany: {
            args: Prisma.ListingPerformanceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ListingPerformanceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingPerformancePayload>[]
          }
          delete: {
            args: Prisma.ListingPerformanceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingPerformancePayload>
          }
          update: {
            args: Prisma.ListingPerformanceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingPerformancePayload>
          }
          deleteMany: {
            args: Prisma.ListingPerformanceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ListingPerformanceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ListingPerformanceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingPerformancePayload>
          }
          aggregate: {
            args: Prisma.ListingPerformanceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateListingPerformance>
          }
          groupBy: {
            args: Prisma.ListingPerformanceGroupByArgs<ExtArgs>
            result: $Utils.Optional<ListingPerformanceGroupByOutputType>[]
          }
          count: {
            args: Prisma.ListingPerformanceCountArgs<ExtArgs>
            result: $Utils.Optional<ListingPerformanceCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    accounts: number
    sessions: number
    subscriptions: number
    workspaces: number
    merchOutcomeFeedback: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | UserCountOutputTypeCountAccountsArgs
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
    subscriptions?: boolean | UserCountOutputTypeCountSubscriptionsArgs
    workspaces?: boolean | UserCountOutputTypeCountWorkspacesArgs
    merchOutcomeFeedback?: boolean | UserCountOutputTypeCountMerchOutcomeFeedbackArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSubscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubscriptionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountWorkspacesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkspaceMemberWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountMerchOutcomeFeedbackArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MerchOutcomeFeedbackWhereInput
  }


  /**
   * Count Type WorkspaceCountOutputType
   */

  export type WorkspaceCountOutputType = {
    projects: number
    members: number
  }

  export type WorkspaceCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    projects?: boolean | WorkspaceCountOutputTypeCountProjectsArgs
    members?: boolean | WorkspaceCountOutputTypeCountMembersArgs
  }

  // Custom InputTypes
  /**
   * WorkspaceCountOutputType without action
   */
  export type WorkspaceCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceCountOutputType
     */
    select?: WorkspaceCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * WorkspaceCountOutputType without action
   */
  export type WorkspaceCountOutputTypeCountProjectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
  }

  /**
   * WorkspaceCountOutputType without action
   */
  export type WorkspaceCountOutputTypeCountMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkspaceMemberWhereInput
  }


  /**
   * Count Type ProjectCountOutputType
   */

  export type ProjectCountOutputType = {
    niches: number
  }

  export type ProjectCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    niches?: boolean | ProjectCountOutputTypeCountNichesArgs
  }

  // Custom InputTypes
  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectCountOutputType
     */
    select?: ProjectCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountNichesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NicheWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Account
   */

  export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null
    _avg: AccountAvgAggregateOutputType | null
    _sum: AccountSumAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  export type AccountAvgAggregateOutputType = {
    expires_at: number | null
  }

  export type AccountSumAggregateOutputType = {
    expires_at: number | null
  }

  export type AccountMinAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    provider: string | null
    providerAccountId: string | null
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: string | null
  }

  export type AccountMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    provider: string | null
    providerAccountId: string | null
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: string | null
  }

  export type AccountCountAggregateOutputType = {
    id: number
    userId: number
    type: number
    provider: number
    providerAccountId: number
    refresh_token: number
    access_token: number
    expires_at: number
    token_type: number
    scope: number
    id_token: number
    session_state: number
    _all: number
  }


  export type AccountAvgAggregateInputType = {
    expires_at?: true
  }

  export type AccountSumAggregateInputType = {
    expires_at?: true
  }

  export type AccountMinAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
  }

  export type AccountMaxAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
  }

  export type AccountCountAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
    _all?: true
  }

  export type AccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Account to aggregate.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Accounts
    **/
    _count?: true | AccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AccountAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AccountSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountMaxAggregateInputType
  }

  export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
        [P in keyof T & keyof AggregateAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccount[P]>
      : GetScalarType<T[P], AggregateAccount[P]>
  }




  export type AccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithAggregationInput | AccountOrderByWithAggregationInput[]
    by: AccountScalarFieldEnum[] | AccountScalarFieldEnum
    having?: AccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountCountAggregateInputType | true
    _avg?: AccountAvgAggregateInputType
    _sum?: AccountSumAggregateInputType
    _min?: AccountMinAggregateInputType
    _max?: AccountMaxAggregateInputType
  }

  export type AccountGroupByOutputType = {
    id: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: string | null
    _count: AccountCountAggregateOutputType | null
    _avg: AccountAvgAggregateOutputType | null
    _sum: AccountSumAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  type GetAccountGroupByPayload<T extends AccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountGroupByOutputType[P]>
            : GetScalarType<T[P], AccountGroupByOutputType[P]>
        }
      >
    >


  export type AccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectScalar = {
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
  }

  export type AccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Account"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      type: string
      provider: string
      providerAccountId: string
      refresh_token: string | null
      access_token: string | null
      expires_at: number | null
      token_type: string | null
      scope: string | null
      id_token: string | null
      session_state: string | null
    }, ExtArgs["result"]["account"]>
    composites: {}
  }

  type AccountGetPayload<S extends boolean | null | undefined | AccountDefaultArgs> = $Result.GetResult<Prisma.$AccountPayload, S>

  type AccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AccountFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AccountCountAggregateInputType | true
    }

  export interface AccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Account'], meta: { name: 'Account' } }
    /**
     * Find zero or one Account that matches the filter.
     * @param {AccountFindUniqueArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccountFindUniqueArgs>(args: SelectSubset<T, AccountFindUniqueArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Account that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AccountFindUniqueOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs>(args: SelectSubset<T, AccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Account that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccountFindFirstArgs>(args?: SelectSubset<T, AccountFindFirstArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Account that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccountFindFirstOrThrowArgs>(args?: SelectSubset<T, AccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.account.findMany()
     * 
     * // Get first 10 Accounts
     * const accounts = await prisma.account.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accountWithIdOnly = await prisma.account.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AccountFindManyArgs>(args?: SelectSubset<T, AccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Account.
     * @param {AccountCreateArgs} args - Arguments to create a Account.
     * @example
     * // Create one Account
     * const Account = await prisma.account.create({
     *   data: {
     *     // ... data to create a Account
     *   }
     * })
     * 
     */
    create<T extends AccountCreateArgs>(args: SelectSubset<T, AccountCreateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Accounts.
     * @param {AccountCreateManyArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccountCreateManyArgs>(args?: SelectSubset<T, AccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Accounts and returns the data saved in the database.
     * @param {AccountCreateManyAndReturnArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AccountCreateManyAndReturnArgs>(args?: SelectSubset<T, AccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Account.
     * @param {AccountDeleteArgs} args - Arguments to delete one Account.
     * @example
     * // Delete one Account
     * const Account = await prisma.account.delete({
     *   where: {
     *     // ... filter to delete one Account
     *   }
     * })
     * 
     */
    delete<T extends AccountDeleteArgs>(args: SelectSubset<T, AccountDeleteArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Account.
     * @param {AccountUpdateArgs} args - Arguments to update one Account.
     * @example
     * // Update one Account
     * const account = await prisma.account.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccountUpdateArgs>(args: SelectSubset<T, AccountUpdateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Accounts.
     * @param {AccountDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.account.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccountDeleteManyArgs>(args?: SelectSubset<T, AccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccountUpdateManyArgs>(args: SelectSubset<T, AccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Account.
     * @param {AccountUpsertArgs} args - Arguments to update or create a Account.
     * @example
     * // Update or create a Account
     * const account = await prisma.account.upsert({
     *   create: {
     *     // ... data to create a Account
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account we want to update
     *   }
     * })
     */
    upsert<T extends AccountUpsertArgs>(args: SelectSubset<T, AccountUpsertArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.account.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
    **/
    count<T extends AccountCountArgs>(
      args?: Subset<T, AccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AccountAggregateArgs>(args: Subset<T, AccountAggregateArgs>): Prisma.PrismaPromise<GetAccountAggregateType<T>>

    /**
     * Group by Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountGroupByArgs['orderBy'] }
        : { orderBy?: AccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Account model
   */
  readonly fields: AccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Account.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Account model
   */ 
  interface AccountFieldRefs {
    readonly id: FieldRef<"Account", 'String'>
    readonly userId: FieldRef<"Account", 'String'>
    readonly type: FieldRef<"Account", 'String'>
    readonly provider: FieldRef<"Account", 'String'>
    readonly providerAccountId: FieldRef<"Account", 'String'>
    readonly refresh_token: FieldRef<"Account", 'String'>
    readonly access_token: FieldRef<"Account", 'String'>
    readonly expires_at: FieldRef<"Account", 'Int'>
    readonly token_type: FieldRef<"Account", 'String'>
    readonly scope: FieldRef<"Account", 'String'>
    readonly id_token: FieldRef<"Account", 'String'>
    readonly session_state: FieldRef<"Account", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Account findUnique
   */
  export type AccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findUniqueOrThrow
   */
  export type AccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findFirst
   */
  export type AccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findFirstOrThrow
   */
  export type AccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findMany
   */
  export type AccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Accounts to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account create
   */
  export type AccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to create a Account.
     */
    data: XOR<AccountCreateInput, AccountUncheckedCreateInput>
  }

  /**
   * Account createMany
   */
  export type AccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Account createManyAndReturn
   */
  export type AccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account update
   */
  export type AccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to update a Account.
     */
    data: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
    /**
     * Choose, which Account to update.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account updateMany
   */
  export type AccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
  }

  /**
   * Account upsert
   */
  export type AccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The filter to search for the Account to update in case it exists.
     */
    where: AccountWhereUniqueInput
    /**
     * In case the Account found by the `where` argument doesn't exist, create a new Account with this data.
     */
    create: XOR<AccountCreateInput, AccountUncheckedCreateInput>
    /**
     * In case the Account was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
  }

  /**
   * Account delete
   */
  export type AccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter which Account to delete.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account deleteMany
   */
  export type AccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Accounts to delete
     */
    where?: AccountWhereInput
  }

  /**
   * Account without action
   */
  export type AccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
  }


  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionMinAggregateOutputType = {
    id: string | null
    sessionToken: string | null
    userId: string | null
    expires: Date | null
  }

  export type SessionMaxAggregateOutputType = {
    id: string | null
    sessionToken: string | null
    userId: string | null
    expires: Date | null
  }

  export type SessionCountAggregateOutputType = {
    id: number
    sessionToken: number
    userId: number
    expires: number
    _all: number
  }


  export type SessionMinAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
  }

  export type SessionMaxAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
  }

  export type SessionCountAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
    _all?: true
  }

  export type SessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sessions
    **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }




  export type SessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[]
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum
    having?: SessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    id: string
    sessionToken: string
    userId: string
    expires: Date
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
        }
      >
    >


  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectScalar = {
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
  }

  export type SessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Session"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionToken: string
      userId: string
      expires: Date
    }, ExtArgs["result"]["session"]>
    composites: {}
  }

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> = $Result.GetResult<Prisma.$SessionPayload, S>

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface SessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session'], meta: { name: 'Session' } }
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SessionFindManyArgs>(args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
     */
    create<T extends SessionCreateArgs>(args: SelectSubset<T, SessionCreateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionCreateManyArgs>(args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sessions and returns the data saved in the database.
     * @param {SessionCreateManyAndReturnArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
     */
    delete<T extends SessionDeleteArgs>(args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionUpdateArgs>(args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionDeleteManyArgs>(args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionUpdateManyArgs>(args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SessionAggregateArgs>(args: Subset<T, SessionAggregateArgs>): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Session model
   */
  readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Session model
   */ 
  interface SessionFieldRefs {
    readonly id: FieldRef<"Session", 'String'>
    readonly sessionToken: FieldRef<"Session", 'String'>
    readonly userId: FieldRef<"Session", 'String'>
    readonly expires: FieldRef<"Session", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session create
   */
  export type SessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>
  }

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session createManyAndReturn
   */
  export type SessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session update
   */
  export type SessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
  }

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
  }

  /**
   * Session delete
   */
  export type SessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput
  }

  /**
   * Session without action
   */
  export type SessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
  }


  /**
   * Model VerificationToken
   */

  export type AggregateVerificationToken = {
    _count: VerificationTokenCountAggregateOutputType | null
    _min: VerificationTokenMinAggregateOutputType | null
    _max: VerificationTokenMaxAggregateOutputType | null
  }

  export type VerificationTokenMinAggregateOutputType = {
    identifier: string | null
    token: string | null
    expires: Date | null
  }

  export type VerificationTokenMaxAggregateOutputType = {
    identifier: string | null
    token: string | null
    expires: Date | null
  }

  export type VerificationTokenCountAggregateOutputType = {
    identifier: number
    token: number
    expires: number
    _all: number
  }


  export type VerificationTokenMinAggregateInputType = {
    identifier?: true
    token?: true
    expires?: true
  }

  export type VerificationTokenMaxAggregateInputType = {
    identifier?: true
    token?: true
    expires?: true
  }

  export type VerificationTokenCountAggregateInputType = {
    identifier?: true
    token?: true
    expires?: true
    _all?: true
  }

  export type VerificationTokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VerificationToken to aggregate.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VerificationTokens
    **/
    _count?: true | VerificationTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VerificationTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VerificationTokenMaxAggregateInputType
  }

  export type GetVerificationTokenAggregateType<T extends VerificationTokenAggregateArgs> = {
        [P in keyof T & keyof AggregateVerificationToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVerificationToken[P]>
      : GetScalarType<T[P], AggregateVerificationToken[P]>
  }




  export type VerificationTokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VerificationTokenWhereInput
    orderBy?: VerificationTokenOrderByWithAggregationInput | VerificationTokenOrderByWithAggregationInput[]
    by: VerificationTokenScalarFieldEnum[] | VerificationTokenScalarFieldEnum
    having?: VerificationTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VerificationTokenCountAggregateInputType | true
    _min?: VerificationTokenMinAggregateInputType
    _max?: VerificationTokenMaxAggregateInputType
  }

  export type VerificationTokenGroupByOutputType = {
    identifier: string
    token: string
    expires: Date
    _count: VerificationTokenCountAggregateOutputType | null
    _min: VerificationTokenMinAggregateOutputType | null
    _max: VerificationTokenMaxAggregateOutputType | null
  }

  type GetVerificationTokenGroupByPayload<T extends VerificationTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VerificationTokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VerificationTokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VerificationTokenGroupByOutputType[P]>
            : GetScalarType<T[P], VerificationTokenGroupByOutputType[P]>
        }
      >
    >


  export type VerificationTokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }, ExtArgs["result"]["verificationToken"]>

  export type VerificationTokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }, ExtArgs["result"]["verificationToken"]>

  export type VerificationTokenSelectScalar = {
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }


  export type $VerificationTokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VerificationToken"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      identifier: string
      token: string
      expires: Date
    }, ExtArgs["result"]["verificationToken"]>
    composites: {}
  }

  type VerificationTokenGetPayload<S extends boolean | null | undefined | VerificationTokenDefaultArgs> = $Result.GetResult<Prisma.$VerificationTokenPayload, S>

  type VerificationTokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<VerificationTokenFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: VerificationTokenCountAggregateInputType | true
    }

  export interface VerificationTokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VerificationToken'], meta: { name: 'VerificationToken' } }
    /**
     * Find zero or one VerificationToken that matches the filter.
     * @param {VerificationTokenFindUniqueArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VerificationTokenFindUniqueArgs>(args: SelectSubset<T, VerificationTokenFindUniqueArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one VerificationToken that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {VerificationTokenFindUniqueOrThrowArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VerificationTokenFindUniqueOrThrowArgs>(args: SelectSubset<T, VerificationTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first VerificationToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenFindFirstArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VerificationTokenFindFirstArgs>(args?: SelectSubset<T, VerificationTokenFindFirstArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first VerificationToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenFindFirstOrThrowArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VerificationTokenFindFirstOrThrowArgs>(args?: SelectSubset<T, VerificationTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more VerificationTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VerificationTokens
     * const verificationTokens = await prisma.verificationToken.findMany()
     * 
     * // Get first 10 VerificationTokens
     * const verificationTokens = await prisma.verificationToken.findMany({ take: 10 })
     * 
     * // Only select the `identifier`
     * const verificationTokenWithIdentifierOnly = await prisma.verificationToken.findMany({ select: { identifier: true } })
     * 
     */
    findMany<T extends VerificationTokenFindManyArgs>(args?: SelectSubset<T, VerificationTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a VerificationToken.
     * @param {VerificationTokenCreateArgs} args - Arguments to create a VerificationToken.
     * @example
     * // Create one VerificationToken
     * const VerificationToken = await prisma.verificationToken.create({
     *   data: {
     *     // ... data to create a VerificationToken
     *   }
     * })
     * 
     */
    create<T extends VerificationTokenCreateArgs>(args: SelectSubset<T, VerificationTokenCreateArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many VerificationTokens.
     * @param {VerificationTokenCreateManyArgs} args - Arguments to create many VerificationTokens.
     * @example
     * // Create many VerificationTokens
     * const verificationToken = await prisma.verificationToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VerificationTokenCreateManyArgs>(args?: SelectSubset<T, VerificationTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many VerificationTokens and returns the data saved in the database.
     * @param {VerificationTokenCreateManyAndReturnArgs} args - Arguments to create many VerificationTokens.
     * @example
     * // Create many VerificationTokens
     * const verificationToken = await prisma.verificationToken.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many VerificationTokens and only return the `identifier`
     * const verificationTokenWithIdentifierOnly = await prisma.verificationToken.createManyAndReturn({ 
     *   select: { identifier: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VerificationTokenCreateManyAndReturnArgs>(args?: SelectSubset<T, VerificationTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a VerificationToken.
     * @param {VerificationTokenDeleteArgs} args - Arguments to delete one VerificationToken.
     * @example
     * // Delete one VerificationToken
     * const VerificationToken = await prisma.verificationToken.delete({
     *   where: {
     *     // ... filter to delete one VerificationToken
     *   }
     * })
     * 
     */
    delete<T extends VerificationTokenDeleteArgs>(args: SelectSubset<T, VerificationTokenDeleteArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one VerificationToken.
     * @param {VerificationTokenUpdateArgs} args - Arguments to update one VerificationToken.
     * @example
     * // Update one VerificationToken
     * const verificationToken = await prisma.verificationToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VerificationTokenUpdateArgs>(args: SelectSubset<T, VerificationTokenUpdateArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more VerificationTokens.
     * @param {VerificationTokenDeleteManyArgs} args - Arguments to filter VerificationTokens to delete.
     * @example
     * // Delete a few VerificationTokens
     * const { count } = await prisma.verificationToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VerificationTokenDeleteManyArgs>(args?: SelectSubset<T, VerificationTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VerificationTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VerificationTokens
     * const verificationToken = await prisma.verificationToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VerificationTokenUpdateManyArgs>(args: SelectSubset<T, VerificationTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one VerificationToken.
     * @param {VerificationTokenUpsertArgs} args - Arguments to update or create a VerificationToken.
     * @example
     * // Update or create a VerificationToken
     * const verificationToken = await prisma.verificationToken.upsert({
     *   create: {
     *     // ... data to create a VerificationToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VerificationToken we want to update
     *   }
     * })
     */
    upsert<T extends VerificationTokenUpsertArgs>(args: SelectSubset<T, VerificationTokenUpsertArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of VerificationTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenCountArgs} args - Arguments to filter VerificationTokens to count.
     * @example
     * // Count the number of VerificationTokens
     * const count = await prisma.verificationToken.count({
     *   where: {
     *     // ... the filter for the VerificationTokens we want to count
     *   }
     * })
    **/
    count<T extends VerificationTokenCountArgs>(
      args?: Subset<T, VerificationTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VerificationTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VerificationToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VerificationTokenAggregateArgs>(args: Subset<T, VerificationTokenAggregateArgs>): Prisma.PrismaPromise<GetVerificationTokenAggregateType<T>>

    /**
     * Group by VerificationToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VerificationTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VerificationTokenGroupByArgs['orderBy'] }
        : { orderBy?: VerificationTokenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VerificationTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVerificationTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VerificationToken model
   */
  readonly fields: VerificationTokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VerificationToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VerificationTokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the VerificationToken model
   */ 
  interface VerificationTokenFieldRefs {
    readonly identifier: FieldRef<"VerificationToken", 'String'>
    readonly token: FieldRef<"VerificationToken", 'String'>
    readonly expires: FieldRef<"VerificationToken", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * VerificationToken findUnique
   */
  export type VerificationTokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken findUniqueOrThrow
   */
  export type VerificationTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken findFirst
   */
  export type VerificationTokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VerificationTokens.
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VerificationTokens.
     */
    distinct?: VerificationTokenScalarFieldEnum | VerificationTokenScalarFieldEnum[]
  }

  /**
   * VerificationToken findFirstOrThrow
   */
  export type VerificationTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VerificationTokens.
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VerificationTokens.
     */
    distinct?: VerificationTokenScalarFieldEnum | VerificationTokenScalarFieldEnum[]
  }

  /**
   * VerificationToken findMany
   */
  export type VerificationTokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Filter, which VerificationTokens to fetch.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VerificationTokens.
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    distinct?: VerificationTokenScalarFieldEnum | VerificationTokenScalarFieldEnum[]
  }

  /**
   * VerificationToken create
   */
  export type VerificationTokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * The data needed to create a VerificationToken.
     */
    data: XOR<VerificationTokenCreateInput, VerificationTokenUncheckedCreateInput>
  }

  /**
   * VerificationToken createMany
   */
  export type VerificationTokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VerificationTokens.
     */
    data: VerificationTokenCreateManyInput | VerificationTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VerificationToken createManyAndReturn
   */
  export type VerificationTokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many VerificationTokens.
     */
    data: VerificationTokenCreateManyInput | VerificationTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VerificationToken update
   */
  export type VerificationTokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * The data needed to update a VerificationToken.
     */
    data: XOR<VerificationTokenUpdateInput, VerificationTokenUncheckedUpdateInput>
    /**
     * Choose, which VerificationToken to update.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken updateMany
   */
  export type VerificationTokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VerificationTokens.
     */
    data: XOR<VerificationTokenUpdateManyMutationInput, VerificationTokenUncheckedUpdateManyInput>
    /**
     * Filter which VerificationTokens to update
     */
    where?: VerificationTokenWhereInput
  }

  /**
   * VerificationToken upsert
   */
  export type VerificationTokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * The filter to search for the VerificationToken to update in case it exists.
     */
    where: VerificationTokenWhereUniqueInput
    /**
     * In case the VerificationToken found by the `where` argument doesn't exist, create a new VerificationToken with this data.
     */
    create: XOR<VerificationTokenCreateInput, VerificationTokenUncheckedCreateInput>
    /**
     * In case the VerificationToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VerificationTokenUpdateInput, VerificationTokenUncheckedUpdateInput>
  }

  /**
   * VerificationToken delete
   */
  export type VerificationTokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Filter which VerificationToken to delete.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken deleteMany
   */
  export type VerificationTokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VerificationTokens to delete
     */
    where?: VerificationTokenWhereInput
  }

  /**
   * VerificationToken without action
   */
  export type VerificationTokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    emailVerified: Date | null
    image: string | null
    password: string | null
    role: string | null
    merchBrand: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    emailVerified: Date | null
    image: string | null
    password: string | null
    role: string | null
    merchBrand: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    emailVerified: number
    image: number
    password: number
    role: number
    merchBrand: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    password?: true
    role?: true
    merchBrand?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    password?: true
    role?: true
    merchBrand?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    password?: true
    role?: true
    merchBrand?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string | null
    email: string | null
    emailVerified: Date | null
    image: string | null
    password: string | null
    role: string
    merchBrand: string | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    password?: boolean
    role?: boolean
    merchBrand?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    accounts?: boolean | User$accountsArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    subscriptions?: boolean | User$subscriptionsArgs<ExtArgs>
    workspaces?: boolean | User$workspacesArgs<ExtArgs>
    merchOutcomeFeedback?: boolean | User$merchOutcomeFeedbackArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    password?: boolean
    role?: boolean
    merchBrand?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    password?: boolean
    role?: boolean
    merchBrand?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | User$accountsArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    subscriptions?: boolean | User$subscriptionsArgs<ExtArgs>
    workspaces?: boolean | User$workspacesArgs<ExtArgs>
    merchOutcomeFeedback?: boolean | User$merchOutcomeFeedbackArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      accounts: Prisma.$AccountPayload<ExtArgs>[]
      sessions: Prisma.$SessionPayload<ExtArgs>[]
      subscriptions: Prisma.$SubscriptionPayload<ExtArgs>[]
      workspaces: Prisma.$WorkspaceMemberPayload<ExtArgs>[]
      merchOutcomeFeedback: Prisma.$MerchOutcomeFeedbackPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string | null
      email: string | null
      emailVerified: Date | null
      image: string | null
      password: string | null
      role: string
      merchBrand: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    accounts<T extends User$accountsArgs<ExtArgs> = {}>(args?: Subset<T, User$accountsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany"> | Null>
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany"> | Null>
    subscriptions<T extends User$subscriptionsArgs<ExtArgs> = {}>(args?: Subset<T, User$subscriptionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findMany"> | Null>
    workspaces<T extends User$workspacesArgs<ExtArgs> = {}>(args?: Subset<T, User$workspacesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkspaceMemberPayload<ExtArgs>, T, "findMany"> | Null>
    merchOutcomeFeedback<T extends User$merchOutcomeFeedbackArgs<ExtArgs> = {}>(args?: Subset<T, User$merchOutcomeFeedbackArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MerchOutcomeFeedbackPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly emailVerified: FieldRef<"User", 'DateTime'>
    readonly image: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly merchBrand: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.accounts
   */
  export type User$accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    cursor?: AccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    cursor?: SessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * User.subscriptions
   */
  export type User$subscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    where?: SubscriptionWhereInput
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    cursor?: SubscriptionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * User.workspaces
   */
  export type User$workspacesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceMember
     */
    select?: WorkspaceMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceMemberInclude<ExtArgs> | null
    where?: WorkspaceMemberWhereInput
    orderBy?: WorkspaceMemberOrderByWithRelationInput | WorkspaceMemberOrderByWithRelationInput[]
    cursor?: WorkspaceMemberWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WorkspaceMemberScalarFieldEnum | WorkspaceMemberScalarFieldEnum[]
  }

  /**
   * User.merchOutcomeFeedback
   */
  export type User$merchOutcomeFeedbackArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchOutcomeFeedback
     */
    select?: MerchOutcomeFeedbackSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchOutcomeFeedbackInclude<ExtArgs> | null
    where?: MerchOutcomeFeedbackWhereInput
    orderBy?: MerchOutcomeFeedbackOrderByWithRelationInput | MerchOutcomeFeedbackOrderByWithRelationInput[]
    cursor?: MerchOutcomeFeedbackWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MerchOutcomeFeedbackScalarFieldEnum | MerchOutcomeFeedbackScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Workspace
   */

  export type AggregateWorkspace = {
    _count: WorkspaceCountAggregateOutputType | null
    _min: WorkspaceMinAggregateOutputType | null
    _max: WorkspaceMaxAggregateOutputType | null
  }

  export type WorkspaceMinAggregateOutputType = {
    id: string | null
    name: string | null
    ownerId: string | null
    createdAt: Date | null
  }

  export type WorkspaceMaxAggregateOutputType = {
    id: string | null
    name: string | null
    ownerId: string | null
    createdAt: Date | null
  }

  export type WorkspaceCountAggregateOutputType = {
    id: number
    name: number
    ownerId: number
    createdAt: number
    _all: number
  }


  export type WorkspaceMinAggregateInputType = {
    id?: true
    name?: true
    ownerId?: true
    createdAt?: true
  }

  export type WorkspaceMaxAggregateInputType = {
    id?: true
    name?: true
    ownerId?: true
    createdAt?: true
  }

  export type WorkspaceCountAggregateInputType = {
    id?: true
    name?: true
    ownerId?: true
    createdAt?: true
    _all?: true
  }

  export type WorkspaceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Workspace to aggregate.
     */
    where?: WorkspaceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Workspaces to fetch.
     */
    orderBy?: WorkspaceOrderByWithRelationInput | WorkspaceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WorkspaceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Workspaces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Workspaces.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Workspaces
    **/
    _count?: true | WorkspaceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WorkspaceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WorkspaceMaxAggregateInputType
  }

  export type GetWorkspaceAggregateType<T extends WorkspaceAggregateArgs> = {
        [P in keyof T & keyof AggregateWorkspace]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWorkspace[P]>
      : GetScalarType<T[P], AggregateWorkspace[P]>
  }




  export type WorkspaceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkspaceWhereInput
    orderBy?: WorkspaceOrderByWithAggregationInput | WorkspaceOrderByWithAggregationInput[]
    by: WorkspaceScalarFieldEnum[] | WorkspaceScalarFieldEnum
    having?: WorkspaceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WorkspaceCountAggregateInputType | true
    _min?: WorkspaceMinAggregateInputType
    _max?: WorkspaceMaxAggregateInputType
  }

  export type WorkspaceGroupByOutputType = {
    id: string
    name: string
    ownerId: string
    createdAt: Date
    _count: WorkspaceCountAggregateOutputType | null
    _min: WorkspaceMinAggregateOutputType | null
    _max: WorkspaceMaxAggregateOutputType | null
  }

  type GetWorkspaceGroupByPayload<T extends WorkspaceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WorkspaceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WorkspaceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WorkspaceGroupByOutputType[P]>
            : GetScalarType<T[P], WorkspaceGroupByOutputType[P]>
        }
      >
    >


  export type WorkspaceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    ownerId?: boolean
    createdAt?: boolean
    projects?: boolean | Workspace$projectsArgs<ExtArgs>
    members?: boolean | Workspace$membersArgs<ExtArgs>
    _count?: boolean | WorkspaceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workspace"]>

  export type WorkspaceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    ownerId?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["workspace"]>

  export type WorkspaceSelectScalar = {
    id?: boolean
    name?: boolean
    ownerId?: boolean
    createdAt?: boolean
  }

  export type WorkspaceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    projects?: boolean | Workspace$projectsArgs<ExtArgs>
    members?: boolean | Workspace$membersArgs<ExtArgs>
    _count?: boolean | WorkspaceCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type WorkspaceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $WorkspacePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Workspace"
    objects: {
      projects: Prisma.$ProjectPayload<ExtArgs>[]
      members: Prisma.$WorkspaceMemberPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      ownerId: string
      createdAt: Date
    }, ExtArgs["result"]["workspace"]>
    composites: {}
  }

  type WorkspaceGetPayload<S extends boolean | null | undefined | WorkspaceDefaultArgs> = $Result.GetResult<Prisma.$WorkspacePayload, S>

  type WorkspaceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<WorkspaceFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: WorkspaceCountAggregateInputType | true
    }

  export interface WorkspaceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Workspace'], meta: { name: 'Workspace' } }
    /**
     * Find zero or one Workspace that matches the filter.
     * @param {WorkspaceFindUniqueArgs} args - Arguments to find a Workspace
     * @example
     * // Get one Workspace
     * const workspace = await prisma.workspace.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WorkspaceFindUniqueArgs>(args: SelectSubset<T, WorkspaceFindUniqueArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Workspace that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {WorkspaceFindUniqueOrThrowArgs} args - Arguments to find a Workspace
     * @example
     * // Get one Workspace
     * const workspace = await prisma.workspace.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WorkspaceFindUniqueOrThrowArgs>(args: SelectSubset<T, WorkspaceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Workspace that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceFindFirstArgs} args - Arguments to find a Workspace
     * @example
     * // Get one Workspace
     * const workspace = await prisma.workspace.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WorkspaceFindFirstArgs>(args?: SelectSubset<T, WorkspaceFindFirstArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Workspace that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceFindFirstOrThrowArgs} args - Arguments to find a Workspace
     * @example
     * // Get one Workspace
     * const workspace = await prisma.workspace.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WorkspaceFindFirstOrThrowArgs>(args?: SelectSubset<T, WorkspaceFindFirstOrThrowArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Workspaces that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Workspaces
     * const workspaces = await prisma.workspace.findMany()
     * 
     * // Get first 10 Workspaces
     * const workspaces = await prisma.workspace.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const workspaceWithIdOnly = await prisma.workspace.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WorkspaceFindManyArgs>(args?: SelectSubset<T, WorkspaceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Workspace.
     * @param {WorkspaceCreateArgs} args - Arguments to create a Workspace.
     * @example
     * // Create one Workspace
     * const Workspace = await prisma.workspace.create({
     *   data: {
     *     // ... data to create a Workspace
     *   }
     * })
     * 
     */
    create<T extends WorkspaceCreateArgs>(args: SelectSubset<T, WorkspaceCreateArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Workspaces.
     * @param {WorkspaceCreateManyArgs} args - Arguments to create many Workspaces.
     * @example
     * // Create many Workspaces
     * const workspace = await prisma.workspace.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WorkspaceCreateManyArgs>(args?: SelectSubset<T, WorkspaceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Workspaces and returns the data saved in the database.
     * @param {WorkspaceCreateManyAndReturnArgs} args - Arguments to create many Workspaces.
     * @example
     * // Create many Workspaces
     * const workspace = await prisma.workspace.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Workspaces and only return the `id`
     * const workspaceWithIdOnly = await prisma.workspace.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WorkspaceCreateManyAndReturnArgs>(args?: SelectSubset<T, WorkspaceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Workspace.
     * @param {WorkspaceDeleteArgs} args - Arguments to delete one Workspace.
     * @example
     * // Delete one Workspace
     * const Workspace = await prisma.workspace.delete({
     *   where: {
     *     // ... filter to delete one Workspace
     *   }
     * })
     * 
     */
    delete<T extends WorkspaceDeleteArgs>(args: SelectSubset<T, WorkspaceDeleteArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Workspace.
     * @param {WorkspaceUpdateArgs} args - Arguments to update one Workspace.
     * @example
     * // Update one Workspace
     * const workspace = await prisma.workspace.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WorkspaceUpdateArgs>(args: SelectSubset<T, WorkspaceUpdateArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Workspaces.
     * @param {WorkspaceDeleteManyArgs} args - Arguments to filter Workspaces to delete.
     * @example
     * // Delete a few Workspaces
     * const { count } = await prisma.workspace.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WorkspaceDeleteManyArgs>(args?: SelectSubset<T, WorkspaceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Workspaces.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Workspaces
     * const workspace = await prisma.workspace.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WorkspaceUpdateManyArgs>(args: SelectSubset<T, WorkspaceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Workspace.
     * @param {WorkspaceUpsertArgs} args - Arguments to update or create a Workspace.
     * @example
     * // Update or create a Workspace
     * const workspace = await prisma.workspace.upsert({
     *   create: {
     *     // ... data to create a Workspace
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Workspace we want to update
     *   }
     * })
     */
    upsert<T extends WorkspaceUpsertArgs>(args: SelectSubset<T, WorkspaceUpsertArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Workspaces.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceCountArgs} args - Arguments to filter Workspaces to count.
     * @example
     * // Count the number of Workspaces
     * const count = await prisma.workspace.count({
     *   where: {
     *     // ... the filter for the Workspaces we want to count
     *   }
     * })
    **/
    count<T extends WorkspaceCountArgs>(
      args?: Subset<T, WorkspaceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WorkspaceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Workspace.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WorkspaceAggregateArgs>(args: Subset<T, WorkspaceAggregateArgs>): Prisma.PrismaPromise<GetWorkspaceAggregateType<T>>

    /**
     * Group by Workspace.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WorkspaceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WorkspaceGroupByArgs['orderBy'] }
        : { orderBy?: WorkspaceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WorkspaceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWorkspaceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Workspace model
   */
  readonly fields: WorkspaceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Workspace.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WorkspaceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    projects<T extends Workspace$projectsArgs<ExtArgs> = {}>(args?: Subset<T, Workspace$projectsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany"> | Null>
    members<T extends Workspace$membersArgs<ExtArgs> = {}>(args?: Subset<T, Workspace$membersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkspaceMemberPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Workspace model
   */ 
  interface WorkspaceFieldRefs {
    readonly id: FieldRef<"Workspace", 'String'>
    readonly name: FieldRef<"Workspace", 'String'>
    readonly ownerId: FieldRef<"Workspace", 'String'>
    readonly createdAt: FieldRef<"Workspace", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Workspace findUnique
   */
  export type WorkspaceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * Filter, which Workspace to fetch.
     */
    where: WorkspaceWhereUniqueInput
  }

  /**
   * Workspace findUniqueOrThrow
   */
  export type WorkspaceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * Filter, which Workspace to fetch.
     */
    where: WorkspaceWhereUniqueInput
  }

  /**
   * Workspace findFirst
   */
  export type WorkspaceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * Filter, which Workspace to fetch.
     */
    where?: WorkspaceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Workspaces to fetch.
     */
    orderBy?: WorkspaceOrderByWithRelationInput | WorkspaceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Workspaces.
     */
    cursor?: WorkspaceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Workspaces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Workspaces.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Workspaces.
     */
    distinct?: WorkspaceScalarFieldEnum | WorkspaceScalarFieldEnum[]
  }

  /**
   * Workspace findFirstOrThrow
   */
  export type WorkspaceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * Filter, which Workspace to fetch.
     */
    where?: WorkspaceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Workspaces to fetch.
     */
    orderBy?: WorkspaceOrderByWithRelationInput | WorkspaceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Workspaces.
     */
    cursor?: WorkspaceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Workspaces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Workspaces.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Workspaces.
     */
    distinct?: WorkspaceScalarFieldEnum | WorkspaceScalarFieldEnum[]
  }

  /**
   * Workspace findMany
   */
  export type WorkspaceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * Filter, which Workspaces to fetch.
     */
    where?: WorkspaceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Workspaces to fetch.
     */
    orderBy?: WorkspaceOrderByWithRelationInput | WorkspaceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Workspaces.
     */
    cursor?: WorkspaceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Workspaces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Workspaces.
     */
    skip?: number
    distinct?: WorkspaceScalarFieldEnum | WorkspaceScalarFieldEnum[]
  }

  /**
   * Workspace create
   */
  export type WorkspaceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * The data needed to create a Workspace.
     */
    data: XOR<WorkspaceCreateInput, WorkspaceUncheckedCreateInput>
  }

  /**
   * Workspace createMany
   */
  export type WorkspaceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Workspaces.
     */
    data: WorkspaceCreateManyInput | WorkspaceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Workspace createManyAndReturn
   */
  export type WorkspaceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Workspaces.
     */
    data: WorkspaceCreateManyInput | WorkspaceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Workspace update
   */
  export type WorkspaceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * The data needed to update a Workspace.
     */
    data: XOR<WorkspaceUpdateInput, WorkspaceUncheckedUpdateInput>
    /**
     * Choose, which Workspace to update.
     */
    where: WorkspaceWhereUniqueInput
  }

  /**
   * Workspace updateMany
   */
  export type WorkspaceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Workspaces.
     */
    data: XOR<WorkspaceUpdateManyMutationInput, WorkspaceUncheckedUpdateManyInput>
    /**
     * Filter which Workspaces to update
     */
    where?: WorkspaceWhereInput
  }

  /**
   * Workspace upsert
   */
  export type WorkspaceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * The filter to search for the Workspace to update in case it exists.
     */
    where: WorkspaceWhereUniqueInput
    /**
     * In case the Workspace found by the `where` argument doesn't exist, create a new Workspace with this data.
     */
    create: XOR<WorkspaceCreateInput, WorkspaceUncheckedCreateInput>
    /**
     * In case the Workspace was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WorkspaceUpdateInput, WorkspaceUncheckedUpdateInput>
  }

  /**
   * Workspace delete
   */
  export type WorkspaceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * Filter which Workspace to delete.
     */
    where: WorkspaceWhereUniqueInput
  }

  /**
   * Workspace deleteMany
   */
  export type WorkspaceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Workspaces to delete
     */
    where?: WorkspaceWhereInput
  }

  /**
   * Workspace.projects
   */
  export type Workspace$projectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    cursor?: ProjectWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Workspace.members
   */
  export type Workspace$membersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceMember
     */
    select?: WorkspaceMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceMemberInclude<ExtArgs> | null
    where?: WorkspaceMemberWhereInput
    orderBy?: WorkspaceMemberOrderByWithRelationInput | WorkspaceMemberOrderByWithRelationInput[]
    cursor?: WorkspaceMemberWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WorkspaceMemberScalarFieldEnum | WorkspaceMemberScalarFieldEnum[]
  }

  /**
   * Workspace without action
   */
  export type WorkspaceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
  }


  /**
   * Model WorkspaceMember
   */

  export type AggregateWorkspaceMember = {
    _count: WorkspaceMemberCountAggregateOutputType | null
    _min: WorkspaceMemberMinAggregateOutputType | null
    _max: WorkspaceMemberMaxAggregateOutputType | null
  }

  export type WorkspaceMemberMinAggregateOutputType = {
    id: string | null
    userId: string | null
    workspaceId: string | null
    role: string | null
  }

  export type WorkspaceMemberMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    workspaceId: string | null
    role: string | null
  }

  export type WorkspaceMemberCountAggregateOutputType = {
    id: number
    userId: number
    workspaceId: number
    role: number
    _all: number
  }


  export type WorkspaceMemberMinAggregateInputType = {
    id?: true
    userId?: true
    workspaceId?: true
    role?: true
  }

  export type WorkspaceMemberMaxAggregateInputType = {
    id?: true
    userId?: true
    workspaceId?: true
    role?: true
  }

  export type WorkspaceMemberCountAggregateInputType = {
    id?: true
    userId?: true
    workspaceId?: true
    role?: true
    _all?: true
  }

  export type WorkspaceMemberAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WorkspaceMember to aggregate.
     */
    where?: WorkspaceMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkspaceMembers to fetch.
     */
    orderBy?: WorkspaceMemberOrderByWithRelationInput | WorkspaceMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WorkspaceMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkspaceMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkspaceMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WorkspaceMembers
    **/
    _count?: true | WorkspaceMemberCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WorkspaceMemberMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WorkspaceMemberMaxAggregateInputType
  }

  export type GetWorkspaceMemberAggregateType<T extends WorkspaceMemberAggregateArgs> = {
        [P in keyof T & keyof AggregateWorkspaceMember]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWorkspaceMember[P]>
      : GetScalarType<T[P], AggregateWorkspaceMember[P]>
  }




  export type WorkspaceMemberGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkspaceMemberWhereInput
    orderBy?: WorkspaceMemberOrderByWithAggregationInput | WorkspaceMemberOrderByWithAggregationInput[]
    by: WorkspaceMemberScalarFieldEnum[] | WorkspaceMemberScalarFieldEnum
    having?: WorkspaceMemberScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WorkspaceMemberCountAggregateInputType | true
    _min?: WorkspaceMemberMinAggregateInputType
    _max?: WorkspaceMemberMaxAggregateInputType
  }

  export type WorkspaceMemberGroupByOutputType = {
    id: string
    userId: string
    workspaceId: string
    role: string
    _count: WorkspaceMemberCountAggregateOutputType | null
    _min: WorkspaceMemberMinAggregateOutputType | null
    _max: WorkspaceMemberMaxAggregateOutputType | null
  }

  type GetWorkspaceMemberGroupByPayload<T extends WorkspaceMemberGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WorkspaceMemberGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WorkspaceMemberGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WorkspaceMemberGroupByOutputType[P]>
            : GetScalarType<T[P], WorkspaceMemberGroupByOutputType[P]>
        }
      >
    >


  export type WorkspaceMemberSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    workspaceId?: boolean
    role?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workspaceMember"]>

  export type WorkspaceMemberSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    workspaceId?: boolean
    role?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workspaceMember"]>

  export type WorkspaceMemberSelectScalar = {
    id?: boolean
    userId?: boolean
    workspaceId?: boolean
    role?: boolean
  }

  export type WorkspaceMemberInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }
  export type WorkspaceMemberIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }

  export type $WorkspaceMemberPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WorkspaceMember"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      workspace: Prisma.$WorkspacePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      workspaceId: string
      role: string
    }, ExtArgs["result"]["workspaceMember"]>
    composites: {}
  }

  type WorkspaceMemberGetPayload<S extends boolean | null | undefined | WorkspaceMemberDefaultArgs> = $Result.GetResult<Prisma.$WorkspaceMemberPayload, S>

  type WorkspaceMemberCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<WorkspaceMemberFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: WorkspaceMemberCountAggregateInputType | true
    }

  export interface WorkspaceMemberDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WorkspaceMember'], meta: { name: 'WorkspaceMember' } }
    /**
     * Find zero or one WorkspaceMember that matches the filter.
     * @param {WorkspaceMemberFindUniqueArgs} args - Arguments to find a WorkspaceMember
     * @example
     * // Get one WorkspaceMember
     * const workspaceMember = await prisma.workspaceMember.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WorkspaceMemberFindUniqueArgs>(args: SelectSubset<T, WorkspaceMemberFindUniqueArgs<ExtArgs>>): Prisma__WorkspaceMemberClient<$Result.GetResult<Prisma.$WorkspaceMemberPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one WorkspaceMember that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {WorkspaceMemberFindUniqueOrThrowArgs} args - Arguments to find a WorkspaceMember
     * @example
     * // Get one WorkspaceMember
     * const workspaceMember = await prisma.workspaceMember.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WorkspaceMemberFindUniqueOrThrowArgs>(args: SelectSubset<T, WorkspaceMemberFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WorkspaceMemberClient<$Result.GetResult<Prisma.$WorkspaceMemberPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first WorkspaceMember that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceMemberFindFirstArgs} args - Arguments to find a WorkspaceMember
     * @example
     * // Get one WorkspaceMember
     * const workspaceMember = await prisma.workspaceMember.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WorkspaceMemberFindFirstArgs>(args?: SelectSubset<T, WorkspaceMemberFindFirstArgs<ExtArgs>>): Prisma__WorkspaceMemberClient<$Result.GetResult<Prisma.$WorkspaceMemberPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first WorkspaceMember that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceMemberFindFirstOrThrowArgs} args - Arguments to find a WorkspaceMember
     * @example
     * // Get one WorkspaceMember
     * const workspaceMember = await prisma.workspaceMember.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WorkspaceMemberFindFirstOrThrowArgs>(args?: SelectSubset<T, WorkspaceMemberFindFirstOrThrowArgs<ExtArgs>>): Prisma__WorkspaceMemberClient<$Result.GetResult<Prisma.$WorkspaceMemberPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more WorkspaceMembers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceMemberFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WorkspaceMembers
     * const workspaceMembers = await prisma.workspaceMember.findMany()
     * 
     * // Get first 10 WorkspaceMembers
     * const workspaceMembers = await prisma.workspaceMember.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const workspaceMemberWithIdOnly = await prisma.workspaceMember.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WorkspaceMemberFindManyArgs>(args?: SelectSubset<T, WorkspaceMemberFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkspaceMemberPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a WorkspaceMember.
     * @param {WorkspaceMemberCreateArgs} args - Arguments to create a WorkspaceMember.
     * @example
     * // Create one WorkspaceMember
     * const WorkspaceMember = await prisma.workspaceMember.create({
     *   data: {
     *     // ... data to create a WorkspaceMember
     *   }
     * })
     * 
     */
    create<T extends WorkspaceMemberCreateArgs>(args: SelectSubset<T, WorkspaceMemberCreateArgs<ExtArgs>>): Prisma__WorkspaceMemberClient<$Result.GetResult<Prisma.$WorkspaceMemberPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many WorkspaceMembers.
     * @param {WorkspaceMemberCreateManyArgs} args - Arguments to create many WorkspaceMembers.
     * @example
     * // Create many WorkspaceMembers
     * const workspaceMember = await prisma.workspaceMember.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WorkspaceMemberCreateManyArgs>(args?: SelectSubset<T, WorkspaceMemberCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WorkspaceMembers and returns the data saved in the database.
     * @param {WorkspaceMemberCreateManyAndReturnArgs} args - Arguments to create many WorkspaceMembers.
     * @example
     * // Create many WorkspaceMembers
     * const workspaceMember = await prisma.workspaceMember.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WorkspaceMembers and only return the `id`
     * const workspaceMemberWithIdOnly = await prisma.workspaceMember.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WorkspaceMemberCreateManyAndReturnArgs>(args?: SelectSubset<T, WorkspaceMemberCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkspaceMemberPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a WorkspaceMember.
     * @param {WorkspaceMemberDeleteArgs} args - Arguments to delete one WorkspaceMember.
     * @example
     * // Delete one WorkspaceMember
     * const WorkspaceMember = await prisma.workspaceMember.delete({
     *   where: {
     *     // ... filter to delete one WorkspaceMember
     *   }
     * })
     * 
     */
    delete<T extends WorkspaceMemberDeleteArgs>(args: SelectSubset<T, WorkspaceMemberDeleteArgs<ExtArgs>>): Prisma__WorkspaceMemberClient<$Result.GetResult<Prisma.$WorkspaceMemberPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one WorkspaceMember.
     * @param {WorkspaceMemberUpdateArgs} args - Arguments to update one WorkspaceMember.
     * @example
     * // Update one WorkspaceMember
     * const workspaceMember = await prisma.workspaceMember.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WorkspaceMemberUpdateArgs>(args: SelectSubset<T, WorkspaceMemberUpdateArgs<ExtArgs>>): Prisma__WorkspaceMemberClient<$Result.GetResult<Prisma.$WorkspaceMemberPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more WorkspaceMembers.
     * @param {WorkspaceMemberDeleteManyArgs} args - Arguments to filter WorkspaceMembers to delete.
     * @example
     * // Delete a few WorkspaceMembers
     * const { count } = await prisma.workspaceMember.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WorkspaceMemberDeleteManyArgs>(args?: SelectSubset<T, WorkspaceMemberDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WorkspaceMembers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceMemberUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WorkspaceMembers
     * const workspaceMember = await prisma.workspaceMember.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WorkspaceMemberUpdateManyArgs>(args: SelectSubset<T, WorkspaceMemberUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one WorkspaceMember.
     * @param {WorkspaceMemberUpsertArgs} args - Arguments to update or create a WorkspaceMember.
     * @example
     * // Update or create a WorkspaceMember
     * const workspaceMember = await prisma.workspaceMember.upsert({
     *   create: {
     *     // ... data to create a WorkspaceMember
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WorkspaceMember we want to update
     *   }
     * })
     */
    upsert<T extends WorkspaceMemberUpsertArgs>(args: SelectSubset<T, WorkspaceMemberUpsertArgs<ExtArgs>>): Prisma__WorkspaceMemberClient<$Result.GetResult<Prisma.$WorkspaceMemberPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of WorkspaceMembers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceMemberCountArgs} args - Arguments to filter WorkspaceMembers to count.
     * @example
     * // Count the number of WorkspaceMembers
     * const count = await prisma.workspaceMember.count({
     *   where: {
     *     // ... the filter for the WorkspaceMembers we want to count
     *   }
     * })
    **/
    count<T extends WorkspaceMemberCountArgs>(
      args?: Subset<T, WorkspaceMemberCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WorkspaceMemberCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WorkspaceMember.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceMemberAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WorkspaceMemberAggregateArgs>(args: Subset<T, WorkspaceMemberAggregateArgs>): Prisma.PrismaPromise<GetWorkspaceMemberAggregateType<T>>

    /**
     * Group by WorkspaceMember.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceMemberGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WorkspaceMemberGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WorkspaceMemberGroupByArgs['orderBy'] }
        : { orderBy?: WorkspaceMemberGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WorkspaceMemberGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWorkspaceMemberGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WorkspaceMember model
   */
  readonly fields: WorkspaceMemberFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WorkspaceMember.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WorkspaceMemberClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    workspace<T extends WorkspaceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WorkspaceDefaultArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WorkspaceMember model
   */ 
  interface WorkspaceMemberFieldRefs {
    readonly id: FieldRef<"WorkspaceMember", 'String'>
    readonly userId: FieldRef<"WorkspaceMember", 'String'>
    readonly workspaceId: FieldRef<"WorkspaceMember", 'String'>
    readonly role: FieldRef<"WorkspaceMember", 'String'>
  }
    

  // Custom InputTypes
  /**
   * WorkspaceMember findUnique
   */
  export type WorkspaceMemberFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceMember
     */
    select?: WorkspaceMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceMemberInclude<ExtArgs> | null
    /**
     * Filter, which WorkspaceMember to fetch.
     */
    where: WorkspaceMemberWhereUniqueInput
  }

  /**
   * WorkspaceMember findUniqueOrThrow
   */
  export type WorkspaceMemberFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceMember
     */
    select?: WorkspaceMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceMemberInclude<ExtArgs> | null
    /**
     * Filter, which WorkspaceMember to fetch.
     */
    where: WorkspaceMemberWhereUniqueInput
  }

  /**
   * WorkspaceMember findFirst
   */
  export type WorkspaceMemberFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceMember
     */
    select?: WorkspaceMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceMemberInclude<ExtArgs> | null
    /**
     * Filter, which WorkspaceMember to fetch.
     */
    where?: WorkspaceMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkspaceMembers to fetch.
     */
    orderBy?: WorkspaceMemberOrderByWithRelationInput | WorkspaceMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WorkspaceMembers.
     */
    cursor?: WorkspaceMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkspaceMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkspaceMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WorkspaceMembers.
     */
    distinct?: WorkspaceMemberScalarFieldEnum | WorkspaceMemberScalarFieldEnum[]
  }

  /**
   * WorkspaceMember findFirstOrThrow
   */
  export type WorkspaceMemberFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceMember
     */
    select?: WorkspaceMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceMemberInclude<ExtArgs> | null
    /**
     * Filter, which WorkspaceMember to fetch.
     */
    where?: WorkspaceMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkspaceMembers to fetch.
     */
    orderBy?: WorkspaceMemberOrderByWithRelationInput | WorkspaceMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WorkspaceMembers.
     */
    cursor?: WorkspaceMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkspaceMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkspaceMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WorkspaceMembers.
     */
    distinct?: WorkspaceMemberScalarFieldEnum | WorkspaceMemberScalarFieldEnum[]
  }

  /**
   * WorkspaceMember findMany
   */
  export type WorkspaceMemberFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceMember
     */
    select?: WorkspaceMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceMemberInclude<ExtArgs> | null
    /**
     * Filter, which WorkspaceMembers to fetch.
     */
    where?: WorkspaceMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkspaceMembers to fetch.
     */
    orderBy?: WorkspaceMemberOrderByWithRelationInput | WorkspaceMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WorkspaceMembers.
     */
    cursor?: WorkspaceMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkspaceMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkspaceMembers.
     */
    skip?: number
    distinct?: WorkspaceMemberScalarFieldEnum | WorkspaceMemberScalarFieldEnum[]
  }

  /**
   * WorkspaceMember create
   */
  export type WorkspaceMemberCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceMember
     */
    select?: WorkspaceMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceMemberInclude<ExtArgs> | null
    /**
     * The data needed to create a WorkspaceMember.
     */
    data: XOR<WorkspaceMemberCreateInput, WorkspaceMemberUncheckedCreateInput>
  }

  /**
   * WorkspaceMember createMany
   */
  export type WorkspaceMemberCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WorkspaceMembers.
     */
    data: WorkspaceMemberCreateManyInput | WorkspaceMemberCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WorkspaceMember createManyAndReturn
   */
  export type WorkspaceMemberCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceMember
     */
    select?: WorkspaceMemberSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many WorkspaceMembers.
     */
    data: WorkspaceMemberCreateManyInput | WorkspaceMemberCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceMemberIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WorkspaceMember update
   */
  export type WorkspaceMemberUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceMember
     */
    select?: WorkspaceMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceMemberInclude<ExtArgs> | null
    /**
     * The data needed to update a WorkspaceMember.
     */
    data: XOR<WorkspaceMemberUpdateInput, WorkspaceMemberUncheckedUpdateInput>
    /**
     * Choose, which WorkspaceMember to update.
     */
    where: WorkspaceMemberWhereUniqueInput
  }

  /**
   * WorkspaceMember updateMany
   */
  export type WorkspaceMemberUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WorkspaceMembers.
     */
    data: XOR<WorkspaceMemberUpdateManyMutationInput, WorkspaceMemberUncheckedUpdateManyInput>
    /**
     * Filter which WorkspaceMembers to update
     */
    where?: WorkspaceMemberWhereInput
  }

  /**
   * WorkspaceMember upsert
   */
  export type WorkspaceMemberUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceMember
     */
    select?: WorkspaceMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceMemberInclude<ExtArgs> | null
    /**
     * The filter to search for the WorkspaceMember to update in case it exists.
     */
    where: WorkspaceMemberWhereUniqueInput
    /**
     * In case the WorkspaceMember found by the `where` argument doesn't exist, create a new WorkspaceMember with this data.
     */
    create: XOR<WorkspaceMemberCreateInput, WorkspaceMemberUncheckedCreateInput>
    /**
     * In case the WorkspaceMember was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WorkspaceMemberUpdateInput, WorkspaceMemberUncheckedUpdateInput>
  }

  /**
   * WorkspaceMember delete
   */
  export type WorkspaceMemberDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceMember
     */
    select?: WorkspaceMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceMemberInclude<ExtArgs> | null
    /**
     * Filter which WorkspaceMember to delete.
     */
    where: WorkspaceMemberWhereUniqueInput
  }

  /**
   * WorkspaceMember deleteMany
   */
  export type WorkspaceMemberDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WorkspaceMembers to delete
     */
    where?: WorkspaceMemberWhereInput
  }

  /**
   * WorkspaceMember without action
   */
  export type WorkspaceMemberDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceMember
     */
    select?: WorkspaceMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceMemberInclude<ExtArgs> | null
  }


  /**
   * Model Project
   */

  export type AggregateProject = {
    _count: ProjectCountAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  export type ProjectMinAggregateOutputType = {
    id: string | null
    name: string | null
    workspaceId: string | null
    createdAt: Date | null
  }

  export type ProjectMaxAggregateOutputType = {
    id: string | null
    name: string | null
    workspaceId: string | null
    createdAt: Date | null
  }

  export type ProjectCountAggregateOutputType = {
    id: number
    name: number
    workspaceId: number
    createdAt: number
    _all: number
  }


  export type ProjectMinAggregateInputType = {
    id?: true
    name?: true
    workspaceId?: true
    createdAt?: true
  }

  export type ProjectMaxAggregateInputType = {
    id?: true
    name?: true
    workspaceId?: true
    createdAt?: true
  }

  export type ProjectCountAggregateInputType = {
    id?: true
    name?: true
    workspaceId?: true
    createdAt?: true
    _all?: true
  }

  export type ProjectAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Project to aggregate.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Projects
    **/
    _count?: true | ProjectCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectMaxAggregateInputType
  }

  export type GetProjectAggregateType<T extends ProjectAggregateArgs> = {
        [P in keyof T & keyof AggregateProject]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProject[P]>
      : GetScalarType<T[P], AggregateProject[P]>
  }




  export type ProjectGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithAggregationInput | ProjectOrderByWithAggregationInput[]
    by: ProjectScalarFieldEnum[] | ProjectScalarFieldEnum
    having?: ProjectScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectCountAggregateInputType | true
    _min?: ProjectMinAggregateInputType
    _max?: ProjectMaxAggregateInputType
  }

  export type ProjectGroupByOutputType = {
    id: string
    name: string
    workspaceId: string
    createdAt: Date
    _count: ProjectCountAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  type GetProjectGroupByPayload<T extends ProjectGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectGroupByOutputType[P]>
        }
      >
    >


  export type ProjectSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    workspaceId?: boolean
    createdAt?: boolean
    niches?: boolean | Project$nichesArgs<ExtArgs>
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    workspaceId?: boolean
    createdAt?: boolean
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectScalar = {
    id?: boolean
    name?: boolean
    workspaceId?: boolean
    createdAt?: boolean
  }

  export type ProjectInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    niches?: boolean | Project$nichesArgs<ExtArgs>
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProjectIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }

  export type $ProjectPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Project"
    objects: {
      niches: Prisma.$NichePayload<ExtArgs>[]
      workspace: Prisma.$WorkspacePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      workspaceId: string
      createdAt: Date
    }, ExtArgs["result"]["project"]>
    composites: {}
  }

  type ProjectGetPayload<S extends boolean | null | undefined | ProjectDefaultArgs> = $Result.GetResult<Prisma.$ProjectPayload, S>

  type ProjectCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ProjectFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ProjectCountAggregateInputType | true
    }

  export interface ProjectDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Project'], meta: { name: 'Project' } }
    /**
     * Find zero or one Project that matches the filter.
     * @param {ProjectFindUniqueArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectFindUniqueArgs>(args: SelectSubset<T, ProjectFindUniqueArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Project that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ProjectFindUniqueOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectFindUniqueOrThrowArgs>(args: SelectSubset<T, ProjectFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Project that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectFindFirstArgs>(args?: SelectSubset<T, ProjectFindFirstArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Project that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectFindFirstOrThrowArgs>(args?: SelectSubset<T, ProjectFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Projects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Projects
     * const projects = await prisma.project.findMany()
     * 
     * // Get first 10 Projects
     * const projects = await prisma.project.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectWithIdOnly = await prisma.project.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProjectFindManyArgs>(args?: SelectSubset<T, ProjectFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Project.
     * @param {ProjectCreateArgs} args - Arguments to create a Project.
     * @example
     * // Create one Project
     * const Project = await prisma.project.create({
     *   data: {
     *     // ... data to create a Project
     *   }
     * })
     * 
     */
    create<T extends ProjectCreateArgs>(args: SelectSubset<T, ProjectCreateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Projects.
     * @param {ProjectCreateManyArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProjectCreateManyArgs>(args?: SelectSubset<T, ProjectCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Projects and returns the data saved in the database.
     * @param {ProjectCreateManyAndReturnArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Projects and only return the `id`
     * const projectWithIdOnly = await prisma.project.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProjectCreateManyAndReturnArgs>(args?: SelectSubset<T, ProjectCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Project.
     * @param {ProjectDeleteArgs} args - Arguments to delete one Project.
     * @example
     * // Delete one Project
     * const Project = await prisma.project.delete({
     *   where: {
     *     // ... filter to delete one Project
     *   }
     * })
     * 
     */
    delete<T extends ProjectDeleteArgs>(args: SelectSubset<T, ProjectDeleteArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Project.
     * @param {ProjectUpdateArgs} args - Arguments to update one Project.
     * @example
     * // Update one Project
     * const project = await prisma.project.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProjectUpdateArgs>(args: SelectSubset<T, ProjectUpdateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Projects.
     * @param {ProjectDeleteManyArgs} args - Arguments to filter Projects to delete.
     * @example
     * // Delete a few Projects
     * const { count } = await prisma.project.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProjectDeleteManyArgs>(args?: SelectSubset<T, ProjectDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProjectUpdateManyArgs>(args: SelectSubset<T, ProjectUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Project.
     * @param {ProjectUpsertArgs} args - Arguments to update or create a Project.
     * @example
     * // Update or create a Project
     * const project = await prisma.project.upsert({
     *   create: {
     *     // ... data to create a Project
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Project we want to update
     *   }
     * })
     */
    upsert<T extends ProjectUpsertArgs>(args: SelectSubset<T, ProjectUpsertArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectCountArgs} args - Arguments to filter Projects to count.
     * @example
     * // Count the number of Projects
     * const count = await prisma.project.count({
     *   where: {
     *     // ... the filter for the Projects we want to count
     *   }
     * })
    **/
    count<T extends ProjectCountArgs>(
      args?: Subset<T, ProjectCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProjectAggregateArgs>(args: Subset<T, ProjectAggregateArgs>): Prisma.PrismaPromise<GetProjectAggregateType<T>>

    /**
     * Group by Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProjectGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectGroupByArgs['orderBy'] }
        : { orderBy?: ProjectGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProjectGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Project model
   */
  readonly fields: ProjectFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Project.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    niches<T extends Project$nichesArgs<ExtArgs> = {}>(args?: Subset<T, Project$nichesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NichePayload<ExtArgs>, T, "findMany"> | Null>
    workspace<T extends WorkspaceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WorkspaceDefaultArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Project model
   */ 
  interface ProjectFieldRefs {
    readonly id: FieldRef<"Project", 'String'>
    readonly name: FieldRef<"Project", 'String'>
    readonly workspaceId: FieldRef<"Project", 'String'>
    readonly createdAt: FieldRef<"Project", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Project findUnique
   */
  export type ProjectFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findUniqueOrThrow
   */
  export type ProjectFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findFirst
   */
  export type ProjectFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findFirstOrThrow
   */
  export type ProjectFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findMany
   */
  export type ProjectFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Projects to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project create
   */
  export type ProjectCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to create a Project.
     */
    data: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
  }

  /**
   * Project createMany
   */
  export type ProjectCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Project createManyAndReturn
   */
  export type ProjectCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Project update
   */
  export type ProjectUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to update a Project.
     */
    data: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
    /**
     * Choose, which Project to update.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project updateMany
   */
  export type ProjectUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     */
    where?: ProjectWhereInput
  }

  /**
   * Project upsert
   */
  export type ProjectUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The filter to search for the Project to update in case it exists.
     */
    where: ProjectWhereUniqueInput
    /**
     * In case the Project found by the `where` argument doesn't exist, create a new Project with this data.
     */
    create: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
    /**
     * In case the Project was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
  }

  /**
   * Project delete
   */
  export type ProjectDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter which Project to delete.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project deleteMany
   */
  export type ProjectDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Projects to delete
     */
    where?: ProjectWhereInput
  }

  /**
   * Project.niches
   */
  export type Project$nichesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Niche
     */
    select?: NicheSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NicheInclude<ExtArgs> | null
    where?: NicheWhereInput
    orderBy?: NicheOrderByWithRelationInput | NicheOrderByWithRelationInput[]
    cursor?: NicheWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NicheScalarFieldEnum | NicheScalarFieldEnum[]
  }

  /**
   * Project without action
   */
  export type ProjectDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
  }


  /**
   * Model Niche
   */

  export type AggregateNiche = {
    _count: NicheCountAggregateOutputType | null
    _avg: NicheAvgAggregateOutputType | null
    _sum: NicheSumAggregateOutputType | null
    _min: NicheMinAggregateOutputType | null
    _max: NicheMaxAggregateOutputType | null
  }

  export type NicheAvgAggregateOutputType = {
    score: number | null
    trendScore: number | null
    competitionScore: number | null
  }

  export type NicheSumAggregateOutputType = {
    score: number | null
    trendScore: number | null
    competitionScore: number | null
  }

  export type NicheMinAggregateOutputType = {
    id: string | null
    name: string | null
    score: number | null
    trendScore: number | null
    competitionScore: number | null
    projectId: string | null
  }

  export type NicheMaxAggregateOutputType = {
    id: string | null
    name: string | null
    score: number | null
    trendScore: number | null
    competitionScore: number | null
    projectId: string | null
  }

  export type NicheCountAggregateOutputType = {
    id: number
    name: number
    score: number
    trendScore: number
    competitionScore: number
    projectId: number
    _all: number
  }


  export type NicheAvgAggregateInputType = {
    score?: true
    trendScore?: true
    competitionScore?: true
  }

  export type NicheSumAggregateInputType = {
    score?: true
    trendScore?: true
    competitionScore?: true
  }

  export type NicheMinAggregateInputType = {
    id?: true
    name?: true
    score?: true
    trendScore?: true
    competitionScore?: true
    projectId?: true
  }

  export type NicheMaxAggregateInputType = {
    id?: true
    name?: true
    score?: true
    trendScore?: true
    competitionScore?: true
    projectId?: true
  }

  export type NicheCountAggregateInputType = {
    id?: true
    name?: true
    score?: true
    trendScore?: true
    competitionScore?: true
    projectId?: true
    _all?: true
  }

  export type NicheAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Niche to aggregate.
     */
    where?: NicheWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Niches to fetch.
     */
    orderBy?: NicheOrderByWithRelationInput | NicheOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NicheWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Niches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Niches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Niches
    **/
    _count?: true | NicheCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: NicheAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: NicheSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NicheMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NicheMaxAggregateInputType
  }

  export type GetNicheAggregateType<T extends NicheAggregateArgs> = {
        [P in keyof T & keyof AggregateNiche]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNiche[P]>
      : GetScalarType<T[P], AggregateNiche[P]>
  }




  export type NicheGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NicheWhereInput
    orderBy?: NicheOrderByWithAggregationInput | NicheOrderByWithAggregationInput[]
    by: NicheScalarFieldEnum[] | NicheScalarFieldEnum
    having?: NicheScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NicheCountAggregateInputType | true
    _avg?: NicheAvgAggregateInputType
    _sum?: NicheSumAggregateInputType
    _min?: NicheMinAggregateInputType
    _max?: NicheMaxAggregateInputType
  }

  export type NicheGroupByOutputType = {
    id: string
    name: string
    score: number
    trendScore: number
    competitionScore: number
    projectId: string
    _count: NicheCountAggregateOutputType | null
    _avg: NicheAvgAggregateOutputType | null
    _sum: NicheSumAggregateOutputType | null
    _min: NicheMinAggregateOutputType | null
    _max: NicheMaxAggregateOutputType | null
  }

  type GetNicheGroupByPayload<T extends NicheGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NicheGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NicheGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NicheGroupByOutputType[P]>
            : GetScalarType<T[P], NicheGroupByOutputType[P]>
        }
      >
    >


  export type NicheSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    score?: boolean
    trendScore?: boolean
    competitionScore?: boolean
    projectId?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["niche"]>

  export type NicheSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    score?: boolean
    trendScore?: boolean
    competitionScore?: boolean
    projectId?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["niche"]>

  export type NicheSelectScalar = {
    id?: boolean
    name?: boolean
    score?: boolean
    trendScore?: boolean
    competitionScore?: boolean
    projectId?: boolean
  }

  export type NicheInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type NicheIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }

  export type $NichePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Niche"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      score: number
      trendScore: number
      competitionScore: number
      projectId: string
    }, ExtArgs["result"]["niche"]>
    composites: {}
  }

  type NicheGetPayload<S extends boolean | null | undefined | NicheDefaultArgs> = $Result.GetResult<Prisma.$NichePayload, S>

  type NicheCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<NicheFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: NicheCountAggregateInputType | true
    }

  export interface NicheDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Niche'], meta: { name: 'Niche' } }
    /**
     * Find zero or one Niche that matches the filter.
     * @param {NicheFindUniqueArgs} args - Arguments to find a Niche
     * @example
     * // Get one Niche
     * const niche = await prisma.niche.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NicheFindUniqueArgs>(args: SelectSubset<T, NicheFindUniqueArgs<ExtArgs>>): Prisma__NicheClient<$Result.GetResult<Prisma.$NichePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Niche that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {NicheFindUniqueOrThrowArgs} args - Arguments to find a Niche
     * @example
     * // Get one Niche
     * const niche = await prisma.niche.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NicheFindUniqueOrThrowArgs>(args: SelectSubset<T, NicheFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NicheClient<$Result.GetResult<Prisma.$NichePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Niche that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NicheFindFirstArgs} args - Arguments to find a Niche
     * @example
     * // Get one Niche
     * const niche = await prisma.niche.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NicheFindFirstArgs>(args?: SelectSubset<T, NicheFindFirstArgs<ExtArgs>>): Prisma__NicheClient<$Result.GetResult<Prisma.$NichePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Niche that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NicheFindFirstOrThrowArgs} args - Arguments to find a Niche
     * @example
     * // Get one Niche
     * const niche = await prisma.niche.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NicheFindFirstOrThrowArgs>(args?: SelectSubset<T, NicheFindFirstOrThrowArgs<ExtArgs>>): Prisma__NicheClient<$Result.GetResult<Prisma.$NichePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Niches that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NicheFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Niches
     * const niches = await prisma.niche.findMany()
     * 
     * // Get first 10 Niches
     * const niches = await prisma.niche.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const nicheWithIdOnly = await prisma.niche.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NicheFindManyArgs>(args?: SelectSubset<T, NicheFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NichePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Niche.
     * @param {NicheCreateArgs} args - Arguments to create a Niche.
     * @example
     * // Create one Niche
     * const Niche = await prisma.niche.create({
     *   data: {
     *     // ... data to create a Niche
     *   }
     * })
     * 
     */
    create<T extends NicheCreateArgs>(args: SelectSubset<T, NicheCreateArgs<ExtArgs>>): Prisma__NicheClient<$Result.GetResult<Prisma.$NichePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Niches.
     * @param {NicheCreateManyArgs} args - Arguments to create many Niches.
     * @example
     * // Create many Niches
     * const niche = await prisma.niche.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NicheCreateManyArgs>(args?: SelectSubset<T, NicheCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Niches and returns the data saved in the database.
     * @param {NicheCreateManyAndReturnArgs} args - Arguments to create many Niches.
     * @example
     * // Create many Niches
     * const niche = await prisma.niche.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Niches and only return the `id`
     * const nicheWithIdOnly = await prisma.niche.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NicheCreateManyAndReturnArgs>(args?: SelectSubset<T, NicheCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NichePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Niche.
     * @param {NicheDeleteArgs} args - Arguments to delete one Niche.
     * @example
     * // Delete one Niche
     * const Niche = await prisma.niche.delete({
     *   where: {
     *     // ... filter to delete one Niche
     *   }
     * })
     * 
     */
    delete<T extends NicheDeleteArgs>(args: SelectSubset<T, NicheDeleteArgs<ExtArgs>>): Prisma__NicheClient<$Result.GetResult<Prisma.$NichePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Niche.
     * @param {NicheUpdateArgs} args - Arguments to update one Niche.
     * @example
     * // Update one Niche
     * const niche = await prisma.niche.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NicheUpdateArgs>(args: SelectSubset<T, NicheUpdateArgs<ExtArgs>>): Prisma__NicheClient<$Result.GetResult<Prisma.$NichePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Niches.
     * @param {NicheDeleteManyArgs} args - Arguments to filter Niches to delete.
     * @example
     * // Delete a few Niches
     * const { count } = await prisma.niche.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NicheDeleteManyArgs>(args?: SelectSubset<T, NicheDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Niches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NicheUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Niches
     * const niche = await prisma.niche.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NicheUpdateManyArgs>(args: SelectSubset<T, NicheUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Niche.
     * @param {NicheUpsertArgs} args - Arguments to update or create a Niche.
     * @example
     * // Update or create a Niche
     * const niche = await prisma.niche.upsert({
     *   create: {
     *     // ... data to create a Niche
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Niche we want to update
     *   }
     * })
     */
    upsert<T extends NicheUpsertArgs>(args: SelectSubset<T, NicheUpsertArgs<ExtArgs>>): Prisma__NicheClient<$Result.GetResult<Prisma.$NichePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Niches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NicheCountArgs} args - Arguments to filter Niches to count.
     * @example
     * // Count the number of Niches
     * const count = await prisma.niche.count({
     *   where: {
     *     // ... the filter for the Niches we want to count
     *   }
     * })
    **/
    count<T extends NicheCountArgs>(
      args?: Subset<T, NicheCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NicheCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Niche.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NicheAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NicheAggregateArgs>(args: Subset<T, NicheAggregateArgs>): Prisma.PrismaPromise<GetNicheAggregateType<T>>

    /**
     * Group by Niche.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NicheGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NicheGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NicheGroupByArgs['orderBy'] }
        : { orderBy?: NicheGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NicheGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNicheGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Niche model
   */
  readonly fields: NicheFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Niche.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NicheClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Niche model
   */ 
  interface NicheFieldRefs {
    readonly id: FieldRef<"Niche", 'String'>
    readonly name: FieldRef<"Niche", 'String'>
    readonly score: FieldRef<"Niche", 'Float'>
    readonly trendScore: FieldRef<"Niche", 'Float'>
    readonly competitionScore: FieldRef<"Niche", 'Float'>
    readonly projectId: FieldRef<"Niche", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Niche findUnique
   */
  export type NicheFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Niche
     */
    select?: NicheSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NicheInclude<ExtArgs> | null
    /**
     * Filter, which Niche to fetch.
     */
    where: NicheWhereUniqueInput
  }

  /**
   * Niche findUniqueOrThrow
   */
  export type NicheFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Niche
     */
    select?: NicheSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NicheInclude<ExtArgs> | null
    /**
     * Filter, which Niche to fetch.
     */
    where: NicheWhereUniqueInput
  }

  /**
   * Niche findFirst
   */
  export type NicheFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Niche
     */
    select?: NicheSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NicheInclude<ExtArgs> | null
    /**
     * Filter, which Niche to fetch.
     */
    where?: NicheWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Niches to fetch.
     */
    orderBy?: NicheOrderByWithRelationInput | NicheOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Niches.
     */
    cursor?: NicheWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Niches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Niches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Niches.
     */
    distinct?: NicheScalarFieldEnum | NicheScalarFieldEnum[]
  }

  /**
   * Niche findFirstOrThrow
   */
  export type NicheFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Niche
     */
    select?: NicheSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NicheInclude<ExtArgs> | null
    /**
     * Filter, which Niche to fetch.
     */
    where?: NicheWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Niches to fetch.
     */
    orderBy?: NicheOrderByWithRelationInput | NicheOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Niches.
     */
    cursor?: NicheWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Niches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Niches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Niches.
     */
    distinct?: NicheScalarFieldEnum | NicheScalarFieldEnum[]
  }

  /**
   * Niche findMany
   */
  export type NicheFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Niche
     */
    select?: NicheSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NicheInclude<ExtArgs> | null
    /**
     * Filter, which Niches to fetch.
     */
    where?: NicheWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Niches to fetch.
     */
    orderBy?: NicheOrderByWithRelationInput | NicheOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Niches.
     */
    cursor?: NicheWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Niches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Niches.
     */
    skip?: number
    distinct?: NicheScalarFieldEnum | NicheScalarFieldEnum[]
  }

  /**
   * Niche create
   */
  export type NicheCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Niche
     */
    select?: NicheSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NicheInclude<ExtArgs> | null
    /**
     * The data needed to create a Niche.
     */
    data: XOR<NicheCreateInput, NicheUncheckedCreateInput>
  }

  /**
   * Niche createMany
   */
  export type NicheCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Niches.
     */
    data: NicheCreateManyInput | NicheCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Niche createManyAndReturn
   */
  export type NicheCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Niche
     */
    select?: NicheSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Niches.
     */
    data: NicheCreateManyInput | NicheCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NicheIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Niche update
   */
  export type NicheUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Niche
     */
    select?: NicheSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NicheInclude<ExtArgs> | null
    /**
     * The data needed to update a Niche.
     */
    data: XOR<NicheUpdateInput, NicheUncheckedUpdateInput>
    /**
     * Choose, which Niche to update.
     */
    where: NicheWhereUniqueInput
  }

  /**
   * Niche updateMany
   */
  export type NicheUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Niches.
     */
    data: XOR<NicheUpdateManyMutationInput, NicheUncheckedUpdateManyInput>
    /**
     * Filter which Niches to update
     */
    where?: NicheWhereInput
  }

  /**
   * Niche upsert
   */
  export type NicheUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Niche
     */
    select?: NicheSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NicheInclude<ExtArgs> | null
    /**
     * The filter to search for the Niche to update in case it exists.
     */
    where: NicheWhereUniqueInput
    /**
     * In case the Niche found by the `where` argument doesn't exist, create a new Niche with this data.
     */
    create: XOR<NicheCreateInput, NicheUncheckedCreateInput>
    /**
     * In case the Niche was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NicheUpdateInput, NicheUncheckedUpdateInput>
  }

  /**
   * Niche delete
   */
  export type NicheDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Niche
     */
    select?: NicheSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NicheInclude<ExtArgs> | null
    /**
     * Filter which Niche to delete.
     */
    where: NicheWhereUniqueInput
  }

  /**
   * Niche deleteMany
   */
  export type NicheDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Niches to delete
     */
    where?: NicheWhereInput
  }

  /**
   * Niche without action
   */
  export type NicheDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Niche
     */
    select?: NicheSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NicheInclude<ExtArgs> | null
  }


  /**
   * Model Subscription
   */

  export type AggregateSubscription = {
    _count: SubscriptionCountAggregateOutputType | null
    _min: SubscriptionMinAggregateOutputType | null
    _max: SubscriptionMaxAggregateOutputType | null
  }

  export type SubscriptionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    stripeCustomerId: string | null
    stripeSubId: string | null
    plan: string | null
    status: string | null
    currentPeriodEnd: Date | null
  }

  export type SubscriptionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    stripeCustomerId: string | null
    stripeSubId: string | null
    plan: string | null
    status: string | null
    currentPeriodEnd: Date | null
  }

  export type SubscriptionCountAggregateOutputType = {
    id: number
    userId: number
    stripeCustomerId: number
    stripeSubId: number
    plan: number
    status: number
    currentPeriodEnd: number
    _all: number
  }


  export type SubscriptionMinAggregateInputType = {
    id?: true
    userId?: true
    stripeCustomerId?: true
    stripeSubId?: true
    plan?: true
    status?: true
    currentPeriodEnd?: true
  }

  export type SubscriptionMaxAggregateInputType = {
    id?: true
    userId?: true
    stripeCustomerId?: true
    stripeSubId?: true
    plan?: true
    status?: true
    currentPeriodEnd?: true
  }

  export type SubscriptionCountAggregateInputType = {
    id?: true
    userId?: true
    stripeCustomerId?: true
    stripeSubId?: true
    plan?: true
    status?: true
    currentPeriodEnd?: true
    _all?: true
  }

  export type SubscriptionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Subscription to aggregate.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Subscriptions
    **/
    _count?: true | SubscriptionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SubscriptionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SubscriptionMaxAggregateInputType
  }

  export type GetSubscriptionAggregateType<T extends SubscriptionAggregateArgs> = {
        [P in keyof T & keyof AggregateSubscription]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubscription[P]>
      : GetScalarType<T[P], AggregateSubscription[P]>
  }




  export type SubscriptionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubscriptionWhereInput
    orderBy?: SubscriptionOrderByWithAggregationInput | SubscriptionOrderByWithAggregationInput[]
    by: SubscriptionScalarFieldEnum[] | SubscriptionScalarFieldEnum
    having?: SubscriptionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SubscriptionCountAggregateInputType | true
    _min?: SubscriptionMinAggregateInputType
    _max?: SubscriptionMaxAggregateInputType
  }

  export type SubscriptionGroupByOutputType = {
    id: string
    userId: string
    stripeCustomerId: string | null
    stripeSubId: string | null
    plan: string
    status: string
    currentPeriodEnd: Date | null
    _count: SubscriptionCountAggregateOutputType | null
    _min: SubscriptionMinAggregateOutputType | null
    _max: SubscriptionMaxAggregateOutputType | null
  }

  type GetSubscriptionGroupByPayload<T extends SubscriptionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SubscriptionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SubscriptionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubscriptionGroupByOutputType[P]>
            : GetScalarType<T[P], SubscriptionGroupByOutputType[P]>
        }
      >
    >


  export type SubscriptionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    stripeCustomerId?: boolean
    stripeSubId?: boolean
    plan?: boolean
    status?: boolean
    currentPeriodEnd?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscription"]>

  export type SubscriptionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    stripeCustomerId?: boolean
    stripeSubId?: boolean
    plan?: boolean
    status?: boolean
    currentPeriodEnd?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscription"]>

  export type SubscriptionSelectScalar = {
    id?: boolean
    userId?: boolean
    stripeCustomerId?: boolean
    stripeSubId?: boolean
    plan?: boolean
    status?: boolean
    currentPeriodEnd?: boolean
  }

  export type SubscriptionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SubscriptionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SubscriptionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Subscription"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      stripeCustomerId: string | null
      stripeSubId: string | null
      plan: string
      status: string
      currentPeriodEnd: Date | null
    }, ExtArgs["result"]["subscription"]>
    composites: {}
  }

  type SubscriptionGetPayload<S extends boolean | null | undefined | SubscriptionDefaultArgs> = $Result.GetResult<Prisma.$SubscriptionPayload, S>

  type SubscriptionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SubscriptionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SubscriptionCountAggregateInputType | true
    }

  export interface SubscriptionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Subscription'], meta: { name: 'Subscription' } }
    /**
     * Find zero or one Subscription that matches the filter.
     * @param {SubscriptionFindUniqueArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SubscriptionFindUniqueArgs>(args: SelectSubset<T, SubscriptionFindUniqueArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Subscription that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SubscriptionFindUniqueOrThrowArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SubscriptionFindUniqueOrThrowArgs>(args: SelectSubset<T, SubscriptionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Subscription that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindFirstArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SubscriptionFindFirstArgs>(args?: SelectSubset<T, SubscriptionFindFirstArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Subscription that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindFirstOrThrowArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SubscriptionFindFirstOrThrowArgs>(args?: SelectSubset<T, SubscriptionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Subscriptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Subscriptions
     * const subscriptions = await prisma.subscription.findMany()
     * 
     * // Get first 10 Subscriptions
     * const subscriptions = await prisma.subscription.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const subscriptionWithIdOnly = await prisma.subscription.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SubscriptionFindManyArgs>(args?: SelectSubset<T, SubscriptionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Subscription.
     * @param {SubscriptionCreateArgs} args - Arguments to create a Subscription.
     * @example
     * // Create one Subscription
     * const Subscription = await prisma.subscription.create({
     *   data: {
     *     // ... data to create a Subscription
     *   }
     * })
     * 
     */
    create<T extends SubscriptionCreateArgs>(args: SelectSubset<T, SubscriptionCreateArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Subscriptions.
     * @param {SubscriptionCreateManyArgs} args - Arguments to create many Subscriptions.
     * @example
     * // Create many Subscriptions
     * const subscription = await prisma.subscription.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SubscriptionCreateManyArgs>(args?: SelectSubset<T, SubscriptionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Subscriptions and returns the data saved in the database.
     * @param {SubscriptionCreateManyAndReturnArgs} args - Arguments to create many Subscriptions.
     * @example
     * // Create many Subscriptions
     * const subscription = await prisma.subscription.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Subscriptions and only return the `id`
     * const subscriptionWithIdOnly = await prisma.subscription.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SubscriptionCreateManyAndReturnArgs>(args?: SelectSubset<T, SubscriptionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Subscription.
     * @param {SubscriptionDeleteArgs} args - Arguments to delete one Subscription.
     * @example
     * // Delete one Subscription
     * const Subscription = await prisma.subscription.delete({
     *   where: {
     *     // ... filter to delete one Subscription
     *   }
     * })
     * 
     */
    delete<T extends SubscriptionDeleteArgs>(args: SelectSubset<T, SubscriptionDeleteArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Subscription.
     * @param {SubscriptionUpdateArgs} args - Arguments to update one Subscription.
     * @example
     * // Update one Subscription
     * const subscription = await prisma.subscription.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SubscriptionUpdateArgs>(args: SelectSubset<T, SubscriptionUpdateArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Subscriptions.
     * @param {SubscriptionDeleteManyArgs} args - Arguments to filter Subscriptions to delete.
     * @example
     * // Delete a few Subscriptions
     * const { count } = await prisma.subscription.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SubscriptionDeleteManyArgs>(args?: SelectSubset<T, SubscriptionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Subscriptions
     * const subscription = await prisma.subscription.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SubscriptionUpdateManyArgs>(args: SelectSubset<T, SubscriptionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Subscription.
     * @param {SubscriptionUpsertArgs} args - Arguments to update or create a Subscription.
     * @example
     * // Update or create a Subscription
     * const subscription = await prisma.subscription.upsert({
     *   create: {
     *     // ... data to create a Subscription
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Subscription we want to update
     *   }
     * })
     */
    upsert<T extends SubscriptionUpsertArgs>(args: SelectSubset<T, SubscriptionUpsertArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionCountArgs} args - Arguments to filter Subscriptions to count.
     * @example
     * // Count the number of Subscriptions
     * const count = await prisma.subscription.count({
     *   where: {
     *     // ... the filter for the Subscriptions we want to count
     *   }
     * })
    **/
    count<T extends SubscriptionCountArgs>(
      args?: Subset<T, SubscriptionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubscriptionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Subscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SubscriptionAggregateArgs>(args: Subset<T, SubscriptionAggregateArgs>): Prisma.PrismaPromise<GetSubscriptionAggregateType<T>>

    /**
     * Group by Subscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SubscriptionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SubscriptionGroupByArgs['orderBy'] }
        : { orderBy?: SubscriptionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SubscriptionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubscriptionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Subscription model
   */
  readonly fields: SubscriptionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Subscription.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SubscriptionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Subscription model
   */ 
  interface SubscriptionFieldRefs {
    readonly id: FieldRef<"Subscription", 'String'>
    readonly userId: FieldRef<"Subscription", 'String'>
    readonly stripeCustomerId: FieldRef<"Subscription", 'String'>
    readonly stripeSubId: FieldRef<"Subscription", 'String'>
    readonly plan: FieldRef<"Subscription", 'String'>
    readonly status: FieldRef<"Subscription", 'String'>
    readonly currentPeriodEnd: FieldRef<"Subscription", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Subscription findUnique
   */
  export type SubscriptionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription findUniqueOrThrow
   */
  export type SubscriptionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription findFirst
   */
  export type SubscriptionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Subscriptions.
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Subscriptions.
     */
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Subscription findFirstOrThrow
   */
  export type SubscriptionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Subscriptions.
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Subscriptions.
     */
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Subscription findMany
   */
  export type SubscriptionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscriptions to fetch.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Subscriptions.
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Subscription create
   */
  export type SubscriptionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to create a Subscription.
     */
    data: XOR<SubscriptionCreateInput, SubscriptionUncheckedCreateInput>
  }

  /**
   * Subscription createMany
   */
  export type SubscriptionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Subscriptions.
     */
    data: SubscriptionCreateManyInput | SubscriptionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Subscription createManyAndReturn
   */
  export type SubscriptionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Subscriptions.
     */
    data: SubscriptionCreateManyInput | SubscriptionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Subscription update
   */
  export type SubscriptionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to update a Subscription.
     */
    data: XOR<SubscriptionUpdateInput, SubscriptionUncheckedUpdateInput>
    /**
     * Choose, which Subscription to update.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription updateMany
   */
  export type SubscriptionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Subscriptions.
     */
    data: XOR<SubscriptionUpdateManyMutationInput, SubscriptionUncheckedUpdateManyInput>
    /**
     * Filter which Subscriptions to update
     */
    where?: SubscriptionWhereInput
  }

  /**
   * Subscription upsert
   */
  export type SubscriptionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * The filter to search for the Subscription to update in case it exists.
     */
    where: SubscriptionWhereUniqueInput
    /**
     * In case the Subscription found by the `where` argument doesn't exist, create a new Subscription with this data.
     */
    create: XOR<SubscriptionCreateInput, SubscriptionUncheckedCreateInput>
    /**
     * In case the Subscription was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SubscriptionUpdateInput, SubscriptionUncheckedUpdateInput>
  }

  /**
   * Subscription delete
   */
  export type SubscriptionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter which Subscription to delete.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription deleteMany
   */
  export type SubscriptionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Subscriptions to delete
     */
    where?: SubscriptionWhereInput
  }

  /**
   * Subscription without action
   */
  export type SubscriptionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
  }


  /**
   * Model UsageMetric
   */

  export type AggregateUsageMetric = {
    _count: UsageMetricCountAggregateOutputType | null
    _avg: UsageMetricAvgAggregateOutputType | null
    _sum: UsageMetricSumAggregateOutputType | null
    _min: UsageMetricMinAggregateOutputType | null
    _max: UsageMetricMaxAggregateOutputType | null
  }

  export type UsageMetricAvgAggregateOutputType = {
    value: number | null
  }

  export type UsageMetricSumAggregateOutputType = {
    value: number | null
  }

  export type UsageMetricMinAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    value: number | null
    createdAt: Date | null
  }

  export type UsageMetricMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    value: number | null
    createdAt: Date | null
  }

  export type UsageMetricCountAggregateOutputType = {
    id: number
    userId: number
    type: number
    value: number
    createdAt: number
    _all: number
  }


  export type UsageMetricAvgAggregateInputType = {
    value?: true
  }

  export type UsageMetricSumAggregateInputType = {
    value?: true
  }

  export type UsageMetricMinAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    value?: true
    createdAt?: true
  }

  export type UsageMetricMaxAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    value?: true
    createdAt?: true
  }

  export type UsageMetricCountAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    value?: true
    createdAt?: true
    _all?: true
  }

  export type UsageMetricAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UsageMetric to aggregate.
     */
    where?: UsageMetricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsageMetrics to fetch.
     */
    orderBy?: UsageMetricOrderByWithRelationInput | UsageMetricOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UsageMetricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsageMetrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsageMetrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UsageMetrics
    **/
    _count?: true | UsageMetricCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UsageMetricAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UsageMetricSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UsageMetricMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UsageMetricMaxAggregateInputType
  }

  export type GetUsageMetricAggregateType<T extends UsageMetricAggregateArgs> = {
        [P in keyof T & keyof AggregateUsageMetric]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsageMetric[P]>
      : GetScalarType<T[P], AggregateUsageMetric[P]>
  }




  export type UsageMetricGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UsageMetricWhereInput
    orderBy?: UsageMetricOrderByWithAggregationInput | UsageMetricOrderByWithAggregationInput[]
    by: UsageMetricScalarFieldEnum[] | UsageMetricScalarFieldEnum
    having?: UsageMetricScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UsageMetricCountAggregateInputType | true
    _avg?: UsageMetricAvgAggregateInputType
    _sum?: UsageMetricSumAggregateInputType
    _min?: UsageMetricMinAggregateInputType
    _max?: UsageMetricMaxAggregateInputType
  }

  export type UsageMetricGroupByOutputType = {
    id: string
    userId: string
    type: string
    value: number
    createdAt: Date
    _count: UsageMetricCountAggregateOutputType | null
    _avg: UsageMetricAvgAggregateOutputType | null
    _sum: UsageMetricSumAggregateOutputType | null
    _min: UsageMetricMinAggregateOutputType | null
    _max: UsageMetricMaxAggregateOutputType | null
  }

  type GetUsageMetricGroupByPayload<T extends UsageMetricGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UsageMetricGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UsageMetricGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsageMetricGroupByOutputType[P]>
            : GetScalarType<T[P], UsageMetricGroupByOutputType[P]>
        }
      >
    >


  export type UsageMetricSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    value?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["usageMetric"]>

  export type UsageMetricSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    value?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["usageMetric"]>

  export type UsageMetricSelectScalar = {
    id?: boolean
    userId?: boolean
    type?: boolean
    value?: boolean
    createdAt?: boolean
  }


  export type $UsageMetricPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UsageMetric"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      type: string
      value: number
      createdAt: Date
    }, ExtArgs["result"]["usageMetric"]>
    composites: {}
  }

  type UsageMetricGetPayload<S extends boolean | null | undefined | UsageMetricDefaultArgs> = $Result.GetResult<Prisma.$UsageMetricPayload, S>

  type UsageMetricCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UsageMetricFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UsageMetricCountAggregateInputType | true
    }

  export interface UsageMetricDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UsageMetric'], meta: { name: 'UsageMetric' } }
    /**
     * Find zero or one UsageMetric that matches the filter.
     * @param {UsageMetricFindUniqueArgs} args - Arguments to find a UsageMetric
     * @example
     * // Get one UsageMetric
     * const usageMetric = await prisma.usageMetric.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UsageMetricFindUniqueArgs>(args: SelectSubset<T, UsageMetricFindUniqueArgs<ExtArgs>>): Prisma__UsageMetricClient<$Result.GetResult<Prisma.$UsageMetricPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one UsageMetric that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UsageMetricFindUniqueOrThrowArgs} args - Arguments to find a UsageMetric
     * @example
     * // Get one UsageMetric
     * const usageMetric = await prisma.usageMetric.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UsageMetricFindUniqueOrThrowArgs>(args: SelectSubset<T, UsageMetricFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UsageMetricClient<$Result.GetResult<Prisma.$UsageMetricPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first UsageMetric that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageMetricFindFirstArgs} args - Arguments to find a UsageMetric
     * @example
     * // Get one UsageMetric
     * const usageMetric = await prisma.usageMetric.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UsageMetricFindFirstArgs>(args?: SelectSubset<T, UsageMetricFindFirstArgs<ExtArgs>>): Prisma__UsageMetricClient<$Result.GetResult<Prisma.$UsageMetricPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first UsageMetric that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageMetricFindFirstOrThrowArgs} args - Arguments to find a UsageMetric
     * @example
     * // Get one UsageMetric
     * const usageMetric = await prisma.usageMetric.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UsageMetricFindFirstOrThrowArgs>(args?: SelectSubset<T, UsageMetricFindFirstOrThrowArgs<ExtArgs>>): Prisma__UsageMetricClient<$Result.GetResult<Prisma.$UsageMetricPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more UsageMetrics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageMetricFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UsageMetrics
     * const usageMetrics = await prisma.usageMetric.findMany()
     * 
     * // Get first 10 UsageMetrics
     * const usageMetrics = await prisma.usageMetric.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const usageMetricWithIdOnly = await prisma.usageMetric.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UsageMetricFindManyArgs>(args?: SelectSubset<T, UsageMetricFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsageMetricPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a UsageMetric.
     * @param {UsageMetricCreateArgs} args - Arguments to create a UsageMetric.
     * @example
     * // Create one UsageMetric
     * const UsageMetric = await prisma.usageMetric.create({
     *   data: {
     *     // ... data to create a UsageMetric
     *   }
     * })
     * 
     */
    create<T extends UsageMetricCreateArgs>(args: SelectSubset<T, UsageMetricCreateArgs<ExtArgs>>): Prisma__UsageMetricClient<$Result.GetResult<Prisma.$UsageMetricPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many UsageMetrics.
     * @param {UsageMetricCreateManyArgs} args - Arguments to create many UsageMetrics.
     * @example
     * // Create many UsageMetrics
     * const usageMetric = await prisma.usageMetric.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UsageMetricCreateManyArgs>(args?: SelectSubset<T, UsageMetricCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UsageMetrics and returns the data saved in the database.
     * @param {UsageMetricCreateManyAndReturnArgs} args - Arguments to create many UsageMetrics.
     * @example
     * // Create many UsageMetrics
     * const usageMetric = await prisma.usageMetric.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UsageMetrics and only return the `id`
     * const usageMetricWithIdOnly = await prisma.usageMetric.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UsageMetricCreateManyAndReturnArgs>(args?: SelectSubset<T, UsageMetricCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsageMetricPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a UsageMetric.
     * @param {UsageMetricDeleteArgs} args - Arguments to delete one UsageMetric.
     * @example
     * // Delete one UsageMetric
     * const UsageMetric = await prisma.usageMetric.delete({
     *   where: {
     *     // ... filter to delete one UsageMetric
     *   }
     * })
     * 
     */
    delete<T extends UsageMetricDeleteArgs>(args: SelectSubset<T, UsageMetricDeleteArgs<ExtArgs>>): Prisma__UsageMetricClient<$Result.GetResult<Prisma.$UsageMetricPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one UsageMetric.
     * @param {UsageMetricUpdateArgs} args - Arguments to update one UsageMetric.
     * @example
     * // Update one UsageMetric
     * const usageMetric = await prisma.usageMetric.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UsageMetricUpdateArgs>(args: SelectSubset<T, UsageMetricUpdateArgs<ExtArgs>>): Prisma__UsageMetricClient<$Result.GetResult<Prisma.$UsageMetricPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more UsageMetrics.
     * @param {UsageMetricDeleteManyArgs} args - Arguments to filter UsageMetrics to delete.
     * @example
     * // Delete a few UsageMetrics
     * const { count } = await prisma.usageMetric.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UsageMetricDeleteManyArgs>(args?: SelectSubset<T, UsageMetricDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UsageMetrics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageMetricUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UsageMetrics
     * const usageMetric = await prisma.usageMetric.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UsageMetricUpdateManyArgs>(args: SelectSubset<T, UsageMetricUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one UsageMetric.
     * @param {UsageMetricUpsertArgs} args - Arguments to update or create a UsageMetric.
     * @example
     * // Update or create a UsageMetric
     * const usageMetric = await prisma.usageMetric.upsert({
     *   create: {
     *     // ... data to create a UsageMetric
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UsageMetric we want to update
     *   }
     * })
     */
    upsert<T extends UsageMetricUpsertArgs>(args: SelectSubset<T, UsageMetricUpsertArgs<ExtArgs>>): Prisma__UsageMetricClient<$Result.GetResult<Prisma.$UsageMetricPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of UsageMetrics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageMetricCountArgs} args - Arguments to filter UsageMetrics to count.
     * @example
     * // Count the number of UsageMetrics
     * const count = await prisma.usageMetric.count({
     *   where: {
     *     // ... the filter for the UsageMetrics we want to count
     *   }
     * })
    **/
    count<T extends UsageMetricCountArgs>(
      args?: Subset<T, UsageMetricCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsageMetricCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UsageMetric.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageMetricAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UsageMetricAggregateArgs>(args: Subset<T, UsageMetricAggregateArgs>): Prisma.PrismaPromise<GetUsageMetricAggregateType<T>>

    /**
     * Group by UsageMetric.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageMetricGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UsageMetricGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UsageMetricGroupByArgs['orderBy'] }
        : { orderBy?: UsageMetricGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UsageMetricGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsageMetricGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UsageMetric model
   */
  readonly fields: UsageMetricFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UsageMetric.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UsageMetricClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UsageMetric model
   */ 
  interface UsageMetricFieldRefs {
    readonly id: FieldRef<"UsageMetric", 'String'>
    readonly userId: FieldRef<"UsageMetric", 'String'>
    readonly type: FieldRef<"UsageMetric", 'String'>
    readonly value: FieldRef<"UsageMetric", 'Int'>
    readonly createdAt: FieldRef<"UsageMetric", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UsageMetric findUnique
   */
  export type UsageMetricFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageMetric
     */
    select?: UsageMetricSelect<ExtArgs> | null
    /**
     * Filter, which UsageMetric to fetch.
     */
    where: UsageMetricWhereUniqueInput
  }

  /**
   * UsageMetric findUniqueOrThrow
   */
  export type UsageMetricFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageMetric
     */
    select?: UsageMetricSelect<ExtArgs> | null
    /**
     * Filter, which UsageMetric to fetch.
     */
    where: UsageMetricWhereUniqueInput
  }

  /**
   * UsageMetric findFirst
   */
  export type UsageMetricFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageMetric
     */
    select?: UsageMetricSelect<ExtArgs> | null
    /**
     * Filter, which UsageMetric to fetch.
     */
    where?: UsageMetricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsageMetrics to fetch.
     */
    orderBy?: UsageMetricOrderByWithRelationInput | UsageMetricOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UsageMetrics.
     */
    cursor?: UsageMetricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsageMetrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsageMetrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UsageMetrics.
     */
    distinct?: UsageMetricScalarFieldEnum | UsageMetricScalarFieldEnum[]
  }

  /**
   * UsageMetric findFirstOrThrow
   */
  export type UsageMetricFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageMetric
     */
    select?: UsageMetricSelect<ExtArgs> | null
    /**
     * Filter, which UsageMetric to fetch.
     */
    where?: UsageMetricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsageMetrics to fetch.
     */
    orderBy?: UsageMetricOrderByWithRelationInput | UsageMetricOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UsageMetrics.
     */
    cursor?: UsageMetricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsageMetrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsageMetrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UsageMetrics.
     */
    distinct?: UsageMetricScalarFieldEnum | UsageMetricScalarFieldEnum[]
  }

  /**
   * UsageMetric findMany
   */
  export type UsageMetricFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageMetric
     */
    select?: UsageMetricSelect<ExtArgs> | null
    /**
     * Filter, which UsageMetrics to fetch.
     */
    where?: UsageMetricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsageMetrics to fetch.
     */
    orderBy?: UsageMetricOrderByWithRelationInput | UsageMetricOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UsageMetrics.
     */
    cursor?: UsageMetricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsageMetrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsageMetrics.
     */
    skip?: number
    distinct?: UsageMetricScalarFieldEnum | UsageMetricScalarFieldEnum[]
  }

  /**
   * UsageMetric create
   */
  export type UsageMetricCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageMetric
     */
    select?: UsageMetricSelect<ExtArgs> | null
    /**
     * The data needed to create a UsageMetric.
     */
    data: XOR<UsageMetricCreateInput, UsageMetricUncheckedCreateInput>
  }

  /**
   * UsageMetric createMany
   */
  export type UsageMetricCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UsageMetrics.
     */
    data: UsageMetricCreateManyInput | UsageMetricCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UsageMetric createManyAndReturn
   */
  export type UsageMetricCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageMetric
     */
    select?: UsageMetricSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many UsageMetrics.
     */
    data: UsageMetricCreateManyInput | UsageMetricCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UsageMetric update
   */
  export type UsageMetricUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageMetric
     */
    select?: UsageMetricSelect<ExtArgs> | null
    /**
     * The data needed to update a UsageMetric.
     */
    data: XOR<UsageMetricUpdateInput, UsageMetricUncheckedUpdateInput>
    /**
     * Choose, which UsageMetric to update.
     */
    where: UsageMetricWhereUniqueInput
  }

  /**
   * UsageMetric updateMany
   */
  export type UsageMetricUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UsageMetrics.
     */
    data: XOR<UsageMetricUpdateManyMutationInput, UsageMetricUncheckedUpdateManyInput>
    /**
     * Filter which UsageMetrics to update
     */
    where?: UsageMetricWhereInput
  }

  /**
   * UsageMetric upsert
   */
  export type UsageMetricUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageMetric
     */
    select?: UsageMetricSelect<ExtArgs> | null
    /**
     * The filter to search for the UsageMetric to update in case it exists.
     */
    where: UsageMetricWhereUniqueInput
    /**
     * In case the UsageMetric found by the `where` argument doesn't exist, create a new UsageMetric with this data.
     */
    create: XOR<UsageMetricCreateInput, UsageMetricUncheckedCreateInput>
    /**
     * In case the UsageMetric was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UsageMetricUpdateInput, UsageMetricUncheckedUpdateInput>
  }

  /**
   * UsageMetric delete
   */
  export type UsageMetricDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageMetric
     */
    select?: UsageMetricSelect<ExtArgs> | null
    /**
     * Filter which UsageMetric to delete.
     */
    where: UsageMetricWhereUniqueInput
  }

  /**
   * UsageMetric deleteMany
   */
  export type UsageMetricDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UsageMetrics to delete
     */
    where?: UsageMetricWhereInput
  }

  /**
   * UsageMetric without action
   */
  export type UsageMetricDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageMetric
     */
    select?: UsageMetricSelect<ExtArgs> | null
  }


  /**
   * Model AutopilotJob
   */

  export type AggregateAutopilotJob = {
    _count: AutopilotJobCountAggregateOutputType | null
    _min: AutopilotJobMinAggregateOutputType | null
    _max: AutopilotJobMaxAggregateOutputType | null
  }

  export type AutopilotJobMinAggregateOutputType = {
    id: string | null
    status: string | null
    workspaceId: string | null
    createdAt: Date | null
  }

  export type AutopilotJobMaxAggregateOutputType = {
    id: string | null
    status: string | null
    workspaceId: string | null
    createdAt: Date | null
  }

  export type AutopilotJobCountAggregateOutputType = {
    id: number
    status: number
    workspaceId: number
    createdAt: number
    _all: number
  }


  export type AutopilotJobMinAggregateInputType = {
    id?: true
    status?: true
    workspaceId?: true
    createdAt?: true
  }

  export type AutopilotJobMaxAggregateInputType = {
    id?: true
    status?: true
    workspaceId?: true
    createdAt?: true
  }

  export type AutopilotJobCountAggregateInputType = {
    id?: true
    status?: true
    workspaceId?: true
    createdAt?: true
    _all?: true
  }

  export type AutopilotJobAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AutopilotJob to aggregate.
     */
    where?: AutopilotJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AutopilotJobs to fetch.
     */
    orderBy?: AutopilotJobOrderByWithRelationInput | AutopilotJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AutopilotJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AutopilotJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AutopilotJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AutopilotJobs
    **/
    _count?: true | AutopilotJobCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AutopilotJobMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AutopilotJobMaxAggregateInputType
  }

  export type GetAutopilotJobAggregateType<T extends AutopilotJobAggregateArgs> = {
        [P in keyof T & keyof AggregateAutopilotJob]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAutopilotJob[P]>
      : GetScalarType<T[P], AggregateAutopilotJob[P]>
  }




  export type AutopilotJobGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AutopilotJobWhereInput
    orderBy?: AutopilotJobOrderByWithAggregationInput | AutopilotJobOrderByWithAggregationInput[]
    by: AutopilotJobScalarFieldEnum[] | AutopilotJobScalarFieldEnum
    having?: AutopilotJobScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AutopilotJobCountAggregateInputType | true
    _min?: AutopilotJobMinAggregateInputType
    _max?: AutopilotJobMaxAggregateInputType
  }

  export type AutopilotJobGroupByOutputType = {
    id: string
    status: string
    workspaceId: string
    createdAt: Date
    _count: AutopilotJobCountAggregateOutputType | null
    _min: AutopilotJobMinAggregateOutputType | null
    _max: AutopilotJobMaxAggregateOutputType | null
  }

  type GetAutopilotJobGroupByPayload<T extends AutopilotJobGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AutopilotJobGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AutopilotJobGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AutopilotJobGroupByOutputType[P]>
            : GetScalarType<T[P], AutopilotJobGroupByOutputType[P]>
        }
      >
    >


  export type AutopilotJobSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    status?: boolean
    workspaceId?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["autopilotJob"]>

  export type AutopilotJobSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    status?: boolean
    workspaceId?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["autopilotJob"]>

  export type AutopilotJobSelectScalar = {
    id?: boolean
    status?: boolean
    workspaceId?: boolean
    createdAt?: boolean
  }


  export type $AutopilotJobPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AutopilotJob"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      status: string
      workspaceId: string
      createdAt: Date
    }, ExtArgs["result"]["autopilotJob"]>
    composites: {}
  }

  type AutopilotJobGetPayload<S extends boolean | null | undefined | AutopilotJobDefaultArgs> = $Result.GetResult<Prisma.$AutopilotJobPayload, S>

  type AutopilotJobCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AutopilotJobFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AutopilotJobCountAggregateInputType | true
    }

  export interface AutopilotJobDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AutopilotJob'], meta: { name: 'AutopilotJob' } }
    /**
     * Find zero or one AutopilotJob that matches the filter.
     * @param {AutopilotJobFindUniqueArgs} args - Arguments to find a AutopilotJob
     * @example
     * // Get one AutopilotJob
     * const autopilotJob = await prisma.autopilotJob.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AutopilotJobFindUniqueArgs>(args: SelectSubset<T, AutopilotJobFindUniqueArgs<ExtArgs>>): Prisma__AutopilotJobClient<$Result.GetResult<Prisma.$AutopilotJobPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AutopilotJob that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AutopilotJobFindUniqueOrThrowArgs} args - Arguments to find a AutopilotJob
     * @example
     * // Get one AutopilotJob
     * const autopilotJob = await prisma.autopilotJob.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AutopilotJobFindUniqueOrThrowArgs>(args: SelectSubset<T, AutopilotJobFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AutopilotJobClient<$Result.GetResult<Prisma.$AutopilotJobPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AutopilotJob that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AutopilotJobFindFirstArgs} args - Arguments to find a AutopilotJob
     * @example
     * // Get one AutopilotJob
     * const autopilotJob = await prisma.autopilotJob.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AutopilotJobFindFirstArgs>(args?: SelectSubset<T, AutopilotJobFindFirstArgs<ExtArgs>>): Prisma__AutopilotJobClient<$Result.GetResult<Prisma.$AutopilotJobPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AutopilotJob that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AutopilotJobFindFirstOrThrowArgs} args - Arguments to find a AutopilotJob
     * @example
     * // Get one AutopilotJob
     * const autopilotJob = await prisma.autopilotJob.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AutopilotJobFindFirstOrThrowArgs>(args?: SelectSubset<T, AutopilotJobFindFirstOrThrowArgs<ExtArgs>>): Prisma__AutopilotJobClient<$Result.GetResult<Prisma.$AutopilotJobPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AutopilotJobs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AutopilotJobFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AutopilotJobs
     * const autopilotJobs = await prisma.autopilotJob.findMany()
     * 
     * // Get first 10 AutopilotJobs
     * const autopilotJobs = await prisma.autopilotJob.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const autopilotJobWithIdOnly = await prisma.autopilotJob.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AutopilotJobFindManyArgs>(args?: SelectSubset<T, AutopilotJobFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AutopilotJobPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AutopilotJob.
     * @param {AutopilotJobCreateArgs} args - Arguments to create a AutopilotJob.
     * @example
     * // Create one AutopilotJob
     * const AutopilotJob = await prisma.autopilotJob.create({
     *   data: {
     *     // ... data to create a AutopilotJob
     *   }
     * })
     * 
     */
    create<T extends AutopilotJobCreateArgs>(args: SelectSubset<T, AutopilotJobCreateArgs<ExtArgs>>): Prisma__AutopilotJobClient<$Result.GetResult<Prisma.$AutopilotJobPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AutopilotJobs.
     * @param {AutopilotJobCreateManyArgs} args - Arguments to create many AutopilotJobs.
     * @example
     * // Create many AutopilotJobs
     * const autopilotJob = await prisma.autopilotJob.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AutopilotJobCreateManyArgs>(args?: SelectSubset<T, AutopilotJobCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AutopilotJobs and returns the data saved in the database.
     * @param {AutopilotJobCreateManyAndReturnArgs} args - Arguments to create many AutopilotJobs.
     * @example
     * // Create many AutopilotJobs
     * const autopilotJob = await prisma.autopilotJob.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AutopilotJobs and only return the `id`
     * const autopilotJobWithIdOnly = await prisma.autopilotJob.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AutopilotJobCreateManyAndReturnArgs>(args?: SelectSubset<T, AutopilotJobCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AutopilotJobPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AutopilotJob.
     * @param {AutopilotJobDeleteArgs} args - Arguments to delete one AutopilotJob.
     * @example
     * // Delete one AutopilotJob
     * const AutopilotJob = await prisma.autopilotJob.delete({
     *   where: {
     *     // ... filter to delete one AutopilotJob
     *   }
     * })
     * 
     */
    delete<T extends AutopilotJobDeleteArgs>(args: SelectSubset<T, AutopilotJobDeleteArgs<ExtArgs>>): Prisma__AutopilotJobClient<$Result.GetResult<Prisma.$AutopilotJobPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AutopilotJob.
     * @param {AutopilotJobUpdateArgs} args - Arguments to update one AutopilotJob.
     * @example
     * // Update one AutopilotJob
     * const autopilotJob = await prisma.autopilotJob.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AutopilotJobUpdateArgs>(args: SelectSubset<T, AutopilotJobUpdateArgs<ExtArgs>>): Prisma__AutopilotJobClient<$Result.GetResult<Prisma.$AutopilotJobPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AutopilotJobs.
     * @param {AutopilotJobDeleteManyArgs} args - Arguments to filter AutopilotJobs to delete.
     * @example
     * // Delete a few AutopilotJobs
     * const { count } = await prisma.autopilotJob.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AutopilotJobDeleteManyArgs>(args?: SelectSubset<T, AutopilotJobDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AutopilotJobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AutopilotJobUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AutopilotJobs
     * const autopilotJob = await prisma.autopilotJob.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AutopilotJobUpdateManyArgs>(args: SelectSubset<T, AutopilotJobUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AutopilotJob.
     * @param {AutopilotJobUpsertArgs} args - Arguments to update or create a AutopilotJob.
     * @example
     * // Update or create a AutopilotJob
     * const autopilotJob = await prisma.autopilotJob.upsert({
     *   create: {
     *     // ... data to create a AutopilotJob
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AutopilotJob we want to update
     *   }
     * })
     */
    upsert<T extends AutopilotJobUpsertArgs>(args: SelectSubset<T, AutopilotJobUpsertArgs<ExtArgs>>): Prisma__AutopilotJobClient<$Result.GetResult<Prisma.$AutopilotJobPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AutopilotJobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AutopilotJobCountArgs} args - Arguments to filter AutopilotJobs to count.
     * @example
     * // Count the number of AutopilotJobs
     * const count = await prisma.autopilotJob.count({
     *   where: {
     *     // ... the filter for the AutopilotJobs we want to count
     *   }
     * })
    **/
    count<T extends AutopilotJobCountArgs>(
      args?: Subset<T, AutopilotJobCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AutopilotJobCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AutopilotJob.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AutopilotJobAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AutopilotJobAggregateArgs>(args: Subset<T, AutopilotJobAggregateArgs>): Prisma.PrismaPromise<GetAutopilotJobAggregateType<T>>

    /**
     * Group by AutopilotJob.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AutopilotJobGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AutopilotJobGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AutopilotJobGroupByArgs['orderBy'] }
        : { orderBy?: AutopilotJobGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AutopilotJobGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAutopilotJobGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AutopilotJob model
   */
  readonly fields: AutopilotJobFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AutopilotJob.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AutopilotJobClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AutopilotJob model
   */ 
  interface AutopilotJobFieldRefs {
    readonly id: FieldRef<"AutopilotJob", 'String'>
    readonly status: FieldRef<"AutopilotJob", 'String'>
    readonly workspaceId: FieldRef<"AutopilotJob", 'String'>
    readonly createdAt: FieldRef<"AutopilotJob", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AutopilotJob findUnique
   */
  export type AutopilotJobFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutopilotJob
     */
    select?: AutopilotJobSelect<ExtArgs> | null
    /**
     * Filter, which AutopilotJob to fetch.
     */
    where: AutopilotJobWhereUniqueInput
  }

  /**
   * AutopilotJob findUniqueOrThrow
   */
  export type AutopilotJobFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutopilotJob
     */
    select?: AutopilotJobSelect<ExtArgs> | null
    /**
     * Filter, which AutopilotJob to fetch.
     */
    where: AutopilotJobWhereUniqueInput
  }

  /**
   * AutopilotJob findFirst
   */
  export type AutopilotJobFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutopilotJob
     */
    select?: AutopilotJobSelect<ExtArgs> | null
    /**
     * Filter, which AutopilotJob to fetch.
     */
    where?: AutopilotJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AutopilotJobs to fetch.
     */
    orderBy?: AutopilotJobOrderByWithRelationInput | AutopilotJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AutopilotJobs.
     */
    cursor?: AutopilotJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AutopilotJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AutopilotJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AutopilotJobs.
     */
    distinct?: AutopilotJobScalarFieldEnum | AutopilotJobScalarFieldEnum[]
  }

  /**
   * AutopilotJob findFirstOrThrow
   */
  export type AutopilotJobFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutopilotJob
     */
    select?: AutopilotJobSelect<ExtArgs> | null
    /**
     * Filter, which AutopilotJob to fetch.
     */
    where?: AutopilotJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AutopilotJobs to fetch.
     */
    orderBy?: AutopilotJobOrderByWithRelationInput | AutopilotJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AutopilotJobs.
     */
    cursor?: AutopilotJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AutopilotJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AutopilotJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AutopilotJobs.
     */
    distinct?: AutopilotJobScalarFieldEnum | AutopilotJobScalarFieldEnum[]
  }

  /**
   * AutopilotJob findMany
   */
  export type AutopilotJobFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutopilotJob
     */
    select?: AutopilotJobSelect<ExtArgs> | null
    /**
     * Filter, which AutopilotJobs to fetch.
     */
    where?: AutopilotJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AutopilotJobs to fetch.
     */
    orderBy?: AutopilotJobOrderByWithRelationInput | AutopilotJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AutopilotJobs.
     */
    cursor?: AutopilotJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AutopilotJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AutopilotJobs.
     */
    skip?: number
    distinct?: AutopilotJobScalarFieldEnum | AutopilotJobScalarFieldEnum[]
  }

  /**
   * AutopilotJob create
   */
  export type AutopilotJobCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutopilotJob
     */
    select?: AutopilotJobSelect<ExtArgs> | null
    /**
     * The data needed to create a AutopilotJob.
     */
    data: XOR<AutopilotJobCreateInput, AutopilotJobUncheckedCreateInput>
  }

  /**
   * AutopilotJob createMany
   */
  export type AutopilotJobCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AutopilotJobs.
     */
    data: AutopilotJobCreateManyInput | AutopilotJobCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AutopilotJob createManyAndReturn
   */
  export type AutopilotJobCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutopilotJob
     */
    select?: AutopilotJobSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AutopilotJobs.
     */
    data: AutopilotJobCreateManyInput | AutopilotJobCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AutopilotJob update
   */
  export type AutopilotJobUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutopilotJob
     */
    select?: AutopilotJobSelect<ExtArgs> | null
    /**
     * The data needed to update a AutopilotJob.
     */
    data: XOR<AutopilotJobUpdateInput, AutopilotJobUncheckedUpdateInput>
    /**
     * Choose, which AutopilotJob to update.
     */
    where: AutopilotJobWhereUniqueInput
  }

  /**
   * AutopilotJob updateMany
   */
  export type AutopilotJobUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AutopilotJobs.
     */
    data: XOR<AutopilotJobUpdateManyMutationInput, AutopilotJobUncheckedUpdateManyInput>
    /**
     * Filter which AutopilotJobs to update
     */
    where?: AutopilotJobWhereInput
  }

  /**
   * AutopilotJob upsert
   */
  export type AutopilotJobUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutopilotJob
     */
    select?: AutopilotJobSelect<ExtArgs> | null
    /**
     * The filter to search for the AutopilotJob to update in case it exists.
     */
    where: AutopilotJobWhereUniqueInput
    /**
     * In case the AutopilotJob found by the `where` argument doesn't exist, create a new AutopilotJob with this data.
     */
    create: XOR<AutopilotJobCreateInput, AutopilotJobUncheckedCreateInput>
    /**
     * In case the AutopilotJob was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AutopilotJobUpdateInput, AutopilotJobUncheckedUpdateInput>
  }

  /**
   * AutopilotJob delete
   */
  export type AutopilotJobDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutopilotJob
     */
    select?: AutopilotJobSelect<ExtArgs> | null
    /**
     * Filter which AutopilotJob to delete.
     */
    where: AutopilotJobWhereUniqueInput
  }

  /**
   * AutopilotJob deleteMany
   */
  export type AutopilotJobDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AutopilotJobs to delete
     */
    where?: AutopilotJobWhereInput
  }

  /**
   * AutopilotJob without action
   */
  export type AutopilotJobDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutopilotJob
     */
    select?: AutopilotJobSelect<ExtArgs> | null
  }


  /**
   * Model SignalSnapshot
   */

  export type AggregateSignalSnapshot = {
    _count: SignalSnapshotCountAggregateOutputType | null
    _avg: SignalSnapshotAvgAggregateOutputType | null
    _sum: SignalSnapshotSumAggregateOutputType | null
    _min: SignalSnapshotMinAggregateOutputType | null
    _max: SignalSnapshotMaxAggregateOutputType | null
  }

  export type SignalSnapshotAvgAggregateOutputType = {
    confidence: number | null
  }

  export type SignalSnapshotSumAggregateOutputType = {
    confidence: number | null
  }

  export type SignalSnapshotMinAggregateOutputType = {
    id: string | null
    source: string | null
    snapshotKey: string | null
    fetchedAt: Date | null
    expiresAt: Date | null
    confidence: number | null
    status: string | null
    transport: string | null
    details: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SignalSnapshotMaxAggregateOutputType = {
    id: string | null
    source: string | null
    snapshotKey: string | null
    fetchedAt: Date | null
    expiresAt: Date | null
    confidence: number | null
    status: string | null
    transport: string | null
    details: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SignalSnapshotCountAggregateOutputType = {
    id: number
    source: number
    snapshotKey: number
    data: number
    fetchedAt: number
    expiresAt: number
    confidence: number
    status: number
    transport: number
    details: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SignalSnapshotAvgAggregateInputType = {
    confidence?: true
  }

  export type SignalSnapshotSumAggregateInputType = {
    confidence?: true
  }

  export type SignalSnapshotMinAggregateInputType = {
    id?: true
    source?: true
    snapshotKey?: true
    fetchedAt?: true
    expiresAt?: true
    confidence?: true
    status?: true
    transport?: true
    details?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SignalSnapshotMaxAggregateInputType = {
    id?: true
    source?: true
    snapshotKey?: true
    fetchedAt?: true
    expiresAt?: true
    confidence?: true
    status?: true
    transport?: true
    details?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SignalSnapshotCountAggregateInputType = {
    id?: true
    source?: true
    snapshotKey?: true
    data?: true
    fetchedAt?: true
    expiresAt?: true
    confidence?: true
    status?: true
    transport?: true
    details?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SignalSnapshotAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SignalSnapshot to aggregate.
     */
    where?: SignalSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SignalSnapshots to fetch.
     */
    orderBy?: SignalSnapshotOrderByWithRelationInput | SignalSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SignalSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SignalSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SignalSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SignalSnapshots
    **/
    _count?: true | SignalSnapshotCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SignalSnapshotAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SignalSnapshotSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SignalSnapshotMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SignalSnapshotMaxAggregateInputType
  }

  export type GetSignalSnapshotAggregateType<T extends SignalSnapshotAggregateArgs> = {
        [P in keyof T & keyof AggregateSignalSnapshot]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSignalSnapshot[P]>
      : GetScalarType<T[P], AggregateSignalSnapshot[P]>
  }




  export type SignalSnapshotGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SignalSnapshotWhereInput
    orderBy?: SignalSnapshotOrderByWithAggregationInput | SignalSnapshotOrderByWithAggregationInput[]
    by: SignalSnapshotScalarFieldEnum[] | SignalSnapshotScalarFieldEnum
    having?: SignalSnapshotScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SignalSnapshotCountAggregateInputType | true
    _avg?: SignalSnapshotAvgAggregateInputType
    _sum?: SignalSnapshotSumAggregateInputType
    _min?: SignalSnapshotMinAggregateInputType
    _max?: SignalSnapshotMaxAggregateInputType
  }

  export type SignalSnapshotGroupByOutputType = {
    id: string
    source: string
    snapshotKey: string
    data: JsonValue
    fetchedAt: Date
    expiresAt: Date
    confidence: number
    status: string
    transport: string
    details: string | null
    createdAt: Date
    updatedAt: Date
    _count: SignalSnapshotCountAggregateOutputType | null
    _avg: SignalSnapshotAvgAggregateOutputType | null
    _sum: SignalSnapshotSumAggregateOutputType | null
    _min: SignalSnapshotMinAggregateOutputType | null
    _max: SignalSnapshotMaxAggregateOutputType | null
  }

  type GetSignalSnapshotGroupByPayload<T extends SignalSnapshotGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SignalSnapshotGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SignalSnapshotGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SignalSnapshotGroupByOutputType[P]>
            : GetScalarType<T[P], SignalSnapshotGroupByOutputType[P]>
        }
      >
    >


  export type SignalSnapshotSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    source?: boolean
    snapshotKey?: boolean
    data?: boolean
    fetchedAt?: boolean
    expiresAt?: boolean
    confidence?: boolean
    status?: boolean
    transport?: boolean
    details?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["signalSnapshot"]>

  export type SignalSnapshotSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    source?: boolean
    snapshotKey?: boolean
    data?: boolean
    fetchedAt?: boolean
    expiresAt?: boolean
    confidence?: boolean
    status?: boolean
    transport?: boolean
    details?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["signalSnapshot"]>

  export type SignalSnapshotSelectScalar = {
    id?: boolean
    source?: boolean
    snapshotKey?: boolean
    data?: boolean
    fetchedAt?: boolean
    expiresAt?: boolean
    confidence?: boolean
    status?: boolean
    transport?: boolean
    details?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $SignalSnapshotPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SignalSnapshot"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      source: string
      snapshotKey: string
      data: Prisma.JsonValue
      fetchedAt: Date
      expiresAt: Date
      confidence: number
      status: string
      transport: string
      details: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["signalSnapshot"]>
    composites: {}
  }

  type SignalSnapshotGetPayload<S extends boolean | null | undefined | SignalSnapshotDefaultArgs> = $Result.GetResult<Prisma.$SignalSnapshotPayload, S>

  type SignalSnapshotCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SignalSnapshotFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SignalSnapshotCountAggregateInputType | true
    }

  export interface SignalSnapshotDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SignalSnapshot'], meta: { name: 'SignalSnapshot' } }
    /**
     * Find zero or one SignalSnapshot that matches the filter.
     * @param {SignalSnapshotFindUniqueArgs} args - Arguments to find a SignalSnapshot
     * @example
     * // Get one SignalSnapshot
     * const signalSnapshot = await prisma.signalSnapshot.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SignalSnapshotFindUniqueArgs>(args: SelectSubset<T, SignalSnapshotFindUniqueArgs<ExtArgs>>): Prisma__SignalSnapshotClient<$Result.GetResult<Prisma.$SignalSnapshotPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SignalSnapshot that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SignalSnapshotFindUniqueOrThrowArgs} args - Arguments to find a SignalSnapshot
     * @example
     * // Get one SignalSnapshot
     * const signalSnapshot = await prisma.signalSnapshot.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SignalSnapshotFindUniqueOrThrowArgs>(args: SelectSubset<T, SignalSnapshotFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SignalSnapshotClient<$Result.GetResult<Prisma.$SignalSnapshotPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SignalSnapshot that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SignalSnapshotFindFirstArgs} args - Arguments to find a SignalSnapshot
     * @example
     * // Get one SignalSnapshot
     * const signalSnapshot = await prisma.signalSnapshot.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SignalSnapshotFindFirstArgs>(args?: SelectSubset<T, SignalSnapshotFindFirstArgs<ExtArgs>>): Prisma__SignalSnapshotClient<$Result.GetResult<Prisma.$SignalSnapshotPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SignalSnapshot that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SignalSnapshotFindFirstOrThrowArgs} args - Arguments to find a SignalSnapshot
     * @example
     * // Get one SignalSnapshot
     * const signalSnapshot = await prisma.signalSnapshot.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SignalSnapshotFindFirstOrThrowArgs>(args?: SelectSubset<T, SignalSnapshotFindFirstOrThrowArgs<ExtArgs>>): Prisma__SignalSnapshotClient<$Result.GetResult<Prisma.$SignalSnapshotPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SignalSnapshots that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SignalSnapshotFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SignalSnapshots
     * const signalSnapshots = await prisma.signalSnapshot.findMany()
     * 
     * // Get first 10 SignalSnapshots
     * const signalSnapshots = await prisma.signalSnapshot.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const signalSnapshotWithIdOnly = await prisma.signalSnapshot.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SignalSnapshotFindManyArgs>(args?: SelectSubset<T, SignalSnapshotFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SignalSnapshotPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SignalSnapshot.
     * @param {SignalSnapshotCreateArgs} args - Arguments to create a SignalSnapshot.
     * @example
     * // Create one SignalSnapshot
     * const SignalSnapshot = await prisma.signalSnapshot.create({
     *   data: {
     *     // ... data to create a SignalSnapshot
     *   }
     * })
     * 
     */
    create<T extends SignalSnapshotCreateArgs>(args: SelectSubset<T, SignalSnapshotCreateArgs<ExtArgs>>): Prisma__SignalSnapshotClient<$Result.GetResult<Prisma.$SignalSnapshotPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SignalSnapshots.
     * @param {SignalSnapshotCreateManyArgs} args - Arguments to create many SignalSnapshots.
     * @example
     * // Create many SignalSnapshots
     * const signalSnapshot = await prisma.signalSnapshot.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SignalSnapshotCreateManyArgs>(args?: SelectSubset<T, SignalSnapshotCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SignalSnapshots and returns the data saved in the database.
     * @param {SignalSnapshotCreateManyAndReturnArgs} args - Arguments to create many SignalSnapshots.
     * @example
     * // Create many SignalSnapshots
     * const signalSnapshot = await prisma.signalSnapshot.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SignalSnapshots and only return the `id`
     * const signalSnapshotWithIdOnly = await prisma.signalSnapshot.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SignalSnapshotCreateManyAndReturnArgs>(args?: SelectSubset<T, SignalSnapshotCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SignalSnapshotPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a SignalSnapshot.
     * @param {SignalSnapshotDeleteArgs} args - Arguments to delete one SignalSnapshot.
     * @example
     * // Delete one SignalSnapshot
     * const SignalSnapshot = await prisma.signalSnapshot.delete({
     *   where: {
     *     // ... filter to delete one SignalSnapshot
     *   }
     * })
     * 
     */
    delete<T extends SignalSnapshotDeleteArgs>(args: SelectSubset<T, SignalSnapshotDeleteArgs<ExtArgs>>): Prisma__SignalSnapshotClient<$Result.GetResult<Prisma.$SignalSnapshotPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SignalSnapshot.
     * @param {SignalSnapshotUpdateArgs} args - Arguments to update one SignalSnapshot.
     * @example
     * // Update one SignalSnapshot
     * const signalSnapshot = await prisma.signalSnapshot.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SignalSnapshotUpdateArgs>(args: SelectSubset<T, SignalSnapshotUpdateArgs<ExtArgs>>): Prisma__SignalSnapshotClient<$Result.GetResult<Prisma.$SignalSnapshotPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SignalSnapshots.
     * @param {SignalSnapshotDeleteManyArgs} args - Arguments to filter SignalSnapshots to delete.
     * @example
     * // Delete a few SignalSnapshots
     * const { count } = await prisma.signalSnapshot.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SignalSnapshotDeleteManyArgs>(args?: SelectSubset<T, SignalSnapshotDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SignalSnapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SignalSnapshotUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SignalSnapshots
     * const signalSnapshot = await prisma.signalSnapshot.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SignalSnapshotUpdateManyArgs>(args: SelectSubset<T, SignalSnapshotUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SignalSnapshot.
     * @param {SignalSnapshotUpsertArgs} args - Arguments to update or create a SignalSnapshot.
     * @example
     * // Update or create a SignalSnapshot
     * const signalSnapshot = await prisma.signalSnapshot.upsert({
     *   create: {
     *     // ... data to create a SignalSnapshot
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SignalSnapshot we want to update
     *   }
     * })
     */
    upsert<T extends SignalSnapshotUpsertArgs>(args: SelectSubset<T, SignalSnapshotUpsertArgs<ExtArgs>>): Prisma__SignalSnapshotClient<$Result.GetResult<Prisma.$SignalSnapshotPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of SignalSnapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SignalSnapshotCountArgs} args - Arguments to filter SignalSnapshots to count.
     * @example
     * // Count the number of SignalSnapshots
     * const count = await prisma.signalSnapshot.count({
     *   where: {
     *     // ... the filter for the SignalSnapshots we want to count
     *   }
     * })
    **/
    count<T extends SignalSnapshotCountArgs>(
      args?: Subset<T, SignalSnapshotCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SignalSnapshotCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SignalSnapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SignalSnapshotAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SignalSnapshotAggregateArgs>(args: Subset<T, SignalSnapshotAggregateArgs>): Prisma.PrismaPromise<GetSignalSnapshotAggregateType<T>>

    /**
     * Group by SignalSnapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SignalSnapshotGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SignalSnapshotGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SignalSnapshotGroupByArgs['orderBy'] }
        : { orderBy?: SignalSnapshotGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SignalSnapshotGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSignalSnapshotGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SignalSnapshot model
   */
  readonly fields: SignalSnapshotFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SignalSnapshot.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SignalSnapshotClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SignalSnapshot model
   */ 
  interface SignalSnapshotFieldRefs {
    readonly id: FieldRef<"SignalSnapshot", 'String'>
    readonly source: FieldRef<"SignalSnapshot", 'String'>
    readonly snapshotKey: FieldRef<"SignalSnapshot", 'String'>
    readonly data: FieldRef<"SignalSnapshot", 'Json'>
    readonly fetchedAt: FieldRef<"SignalSnapshot", 'DateTime'>
    readonly expiresAt: FieldRef<"SignalSnapshot", 'DateTime'>
    readonly confidence: FieldRef<"SignalSnapshot", 'Float'>
    readonly status: FieldRef<"SignalSnapshot", 'String'>
    readonly transport: FieldRef<"SignalSnapshot", 'String'>
    readonly details: FieldRef<"SignalSnapshot", 'String'>
    readonly createdAt: FieldRef<"SignalSnapshot", 'DateTime'>
    readonly updatedAt: FieldRef<"SignalSnapshot", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SignalSnapshot findUnique
   */
  export type SignalSnapshotFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SignalSnapshot
     */
    select?: SignalSnapshotSelect<ExtArgs> | null
    /**
     * Filter, which SignalSnapshot to fetch.
     */
    where: SignalSnapshotWhereUniqueInput
  }

  /**
   * SignalSnapshot findUniqueOrThrow
   */
  export type SignalSnapshotFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SignalSnapshot
     */
    select?: SignalSnapshotSelect<ExtArgs> | null
    /**
     * Filter, which SignalSnapshot to fetch.
     */
    where: SignalSnapshotWhereUniqueInput
  }

  /**
   * SignalSnapshot findFirst
   */
  export type SignalSnapshotFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SignalSnapshot
     */
    select?: SignalSnapshotSelect<ExtArgs> | null
    /**
     * Filter, which SignalSnapshot to fetch.
     */
    where?: SignalSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SignalSnapshots to fetch.
     */
    orderBy?: SignalSnapshotOrderByWithRelationInput | SignalSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SignalSnapshots.
     */
    cursor?: SignalSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SignalSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SignalSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SignalSnapshots.
     */
    distinct?: SignalSnapshotScalarFieldEnum | SignalSnapshotScalarFieldEnum[]
  }

  /**
   * SignalSnapshot findFirstOrThrow
   */
  export type SignalSnapshotFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SignalSnapshot
     */
    select?: SignalSnapshotSelect<ExtArgs> | null
    /**
     * Filter, which SignalSnapshot to fetch.
     */
    where?: SignalSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SignalSnapshots to fetch.
     */
    orderBy?: SignalSnapshotOrderByWithRelationInput | SignalSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SignalSnapshots.
     */
    cursor?: SignalSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SignalSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SignalSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SignalSnapshots.
     */
    distinct?: SignalSnapshotScalarFieldEnum | SignalSnapshotScalarFieldEnum[]
  }

  /**
   * SignalSnapshot findMany
   */
  export type SignalSnapshotFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SignalSnapshot
     */
    select?: SignalSnapshotSelect<ExtArgs> | null
    /**
     * Filter, which SignalSnapshots to fetch.
     */
    where?: SignalSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SignalSnapshots to fetch.
     */
    orderBy?: SignalSnapshotOrderByWithRelationInput | SignalSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SignalSnapshots.
     */
    cursor?: SignalSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SignalSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SignalSnapshots.
     */
    skip?: number
    distinct?: SignalSnapshotScalarFieldEnum | SignalSnapshotScalarFieldEnum[]
  }

  /**
   * SignalSnapshot create
   */
  export type SignalSnapshotCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SignalSnapshot
     */
    select?: SignalSnapshotSelect<ExtArgs> | null
    /**
     * The data needed to create a SignalSnapshot.
     */
    data: XOR<SignalSnapshotCreateInput, SignalSnapshotUncheckedCreateInput>
  }

  /**
   * SignalSnapshot createMany
   */
  export type SignalSnapshotCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SignalSnapshots.
     */
    data: SignalSnapshotCreateManyInput | SignalSnapshotCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SignalSnapshot createManyAndReturn
   */
  export type SignalSnapshotCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SignalSnapshot
     */
    select?: SignalSnapshotSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SignalSnapshots.
     */
    data: SignalSnapshotCreateManyInput | SignalSnapshotCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SignalSnapshot update
   */
  export type SignalSnapshotUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SignalSnapshot
     */
    select?: SignalSnapshotSelect<ExtArgs> | null
    /**
     * The data needed to update a SignalSnapshot.
     */
    data: XOR<SignalSnapshotUpdateInput, SignalSnapshotUncheckedUpdateInput>
    /**
     * Choose, which SignalSnapshot to update.
     */
    where: SignalSnapshotWhereUniqueInput
  }

  /**
   * SignalSnapshot updateMany
   */
  export type SignalSnapshotUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SignalSnapshots.
     */
    data: XOR<SignalSnapshotUpdateManyMutationInput, SignalSnapshotUncheckedUpdateManyInput>
    /**
     * Filter which SignalSnapshots to update
     */
    where?: SignalSnapshotWhereInput
  }

  /**
   * SignalSnapshot upsert
   */
  export type SignalSnapshotUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SignalSnapshot
     */
    select?: SignalSnapshotSelect<ExtArgs> | null
    /**
     * The filter to search for the SignalSnapshot to update in case it exists.
     */
    where: SignalSnapshotWhereUniqueInput
    /**
     * In case the SignalSnapshot found by the `where` argument doesn't exist, create a new SignalSnapshot with this data.
     */
    create: XOR<SignalSnapshotCreateInput, SignalSnapshotUncheckedCreateInput>
    /**
     * In case the SignalSnapshot was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SignalSnapshotUpdateInput, SignalSnapshotUncheckedUpdateInput>
  }

  /**
   * SignalSnapshot delete
   */
  export type SignalSnapshotDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SignalSnapshot
     */
    select?: SignalSnapshotSelect<ExtArgs> | null
    /**
     * Filter which SignalSnapshot to delete.
     */
    where: SignalSnapshotWhereUniqueInput
  }

  /**
   * SignalSnapshot deleteMany
   */
  export type SignalSnapshotDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SignalSnapshots to delete
     */
    where?: SignalSnapshotWhereInput
  }

  /**
   * SignalSnapshot without action
   */
  export type SignalSnapshotDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SignalSnapshot
     */
    select?: SignalSnapshotSelect<ExtArgs> | null
  }


  /**
   * Model SignalSourceHealth
   */

  export type AggregateSignalSourceHealth = {
    _count: SignalSourceHealthCountAggregateOutputType | null
    _avg: SignalSourceHealthAvgAggregateOutputType | null
    _sum: SignalSourceHealthSumAggregateOutputType | null
    _min: SignalSourceHealthMinAggregateOutputType | null
    _max: SignalSourceHealthMaxAggregateOutputType | null
  }

  export type SignalSourceHealthAvgAggregateOutputType = {
    failureCount: number | null
  }

  export type SignalSourceHealthSumAggregateOutputType = {
    failureCount: number | null
  }

  export type SignalSourceHealthMinAggregateOutputType = {
    id: string | null
    source: string | null
    status: string | null
    failureCount: number | null
    lastSuccess: Date | null
    lastFailure: Date | null
    cooldownUntil: Date | null
    lastError: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SignalSourceHealthMaxAggregateOutputType = {
    id: string | null
    source: string | null
    status: string | null
    failureCount: number | null
    lastSuccess: Date | null
    lastFailure: Date | null
    cooldownUntil: Date | null
    lastError: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SignalSourceHealthCountAggregateOutputType = {
    id: number
    source: number
    status: number
    failureCount: number
    lastSuccess: number
    lastFailure: number
    cooldownUntil: number
    lastError: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SignalSourceHealthAvgAggregateInputType = {
    failureCount?: true
  }

  export type SignalSourceHealthSumAggregateInputType = {
    failureCount?: true
  }

  export type SignalSourceHealthMinAggregateInputType = {
    id?: true
    source?: true
    status?: true
    failureCount?: true
    lastSuccess?: true
    lastFailure?: true
    cooldownUntil?: true
    lastError?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SignalSourceHealthMaxAggregateInputType = {
    id?: true
    source?: true
    status?: true
    failureCount?: true
    lastSuccess?: true
    lastFailure?: true
    cooldownUntil?: true
    lastError?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SignalSourceHealthCountAggregateInputType = {
    id?: true
    source?: true
    status?: true
    failureCount?: true
    lastSuccess?: true
    lastFailure?: true
    cooldownUntil?: true
    lastError?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SignalSourceHealthAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SignalSourceHealth to aggregate.
     */
    where?: SignalSourceHealthWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SignalSourceHealths to fetch.
     */
    orderBy?: SignalSourceHealthOrderByWithRelationInput | SignalSourceHealthOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SignalSourceHealthWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SignalSourceHealths from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SignalSourceHealths.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SignalSourceHealths
    **/
    _count?: true | SignalSourceHealthCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SignalSourceHealthAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SignalSourceHealthSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SignalSourceHealthMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SignalSourceHealthMaxAggregateInputType
  }

  export type GetSignalSourceHealthAggregateType<T extends SignalSourceHealthAggregateArgs> = {
        [P in keyof T & keyof AggregateSignalSourceHealth]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSignalSourceHealth[P]>
      : GetScalarType<T[P], AggregateSignalSourceHealth[P]>
  }




  export type SignalSourceHealthGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SignalSourceHealthWhereInput
    orderBy?: SignalSourceHealthOrderByWithAggregationInput | SignalSourceHealthOrderByWithAggregationInput[]
    by: SignalSourceHealthScalarFieldEnum[] | SignalSourceHealthScalarFieldEnum
    having?: SignalSourceHealthScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SignalSourceHealthCountAggregateInputType | true
    _avg?: SignalSourceHealthAvgAggregateInputType
    _sum?: SignalSourceHealthSumAggregateInputType
    _min?: SignalSourceHealthMinAggregateInputType
    _max?: SignalSourceHealthMaxAggregateInputType
  }

  export type SignalSourceHealthGroupByOutputType = {
    id: string
    source: string
    status: string
    failureCount: number
    lastSuccess: Date | null
    lastFailure: Date | null
    cooldownUntil: Date | null
    lastError: string | null
    createdAt: Date
    updatedAt: Date
    _count: SignalSourceHealthCountAggregateOutputType | null
    _avg: SignalSourceHealthAvgAggregateOutputType | null
    _sum: SignalSourceHealthSumAggregateOutputType | null
    _min: SignalSourceHealthMinAggregateOutputType | null
    _max: SignalSourceHealthMaxAggregateOutputType | null
  }

  type GetSignalSourceHealthGroupByPayload<T extends SignalSourceHealthGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SignalSourceHealthGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SignalSourceHealthGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SignalSourceHealthGroupByOutputType[P]>
            : GetScalarType<T[P], SignalSourceHealthGroupByOutputType[P]>
        }
      >
    >


  export type SignalSourceHealthSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    source?: boolean
    status?: boolean
    failureCount?: boolean
    lastSuccess?: boolean
    lastFailure?: boolean
    cooldownUntil?: boolean
    lastError?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["signalSourceHealth"]>

  export type SignalSourceHealthSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    source?: boolean
    status?: boolean
    failureCount?: boolean
    lastSuccess?: boolean
    lastFailure?: boolean
    cooldownUntil?: boolean
    lastError?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["signalSourceHealth"]>

  export type SignalSourceHealthSelectScalar = {
    id?: boolean
    source?: boolean
    status?: boolean
    failureCount?: boolean
    lastSuccess?: boolean
    lastFailure?: boolean
    cooldownUntil?: boolean
    lastError?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $SignalSourceHealthPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SignalSourceHealth"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      source: string
      status: string
      failureCount: number
      lastSuccess: Date | null
      lastFailure: Date | null
      cooldownUntil: Date | null
      lastError: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["signalSourceHealth"]>
    composites: {}
  }

  type SignalSourceHealthGetPayload<S extends boolean | null | undefined | SignalSourceHealthDefaultArgs> = $Result.GetResult<Prisma.$SignalSourceHealthPayload, S>

  type SignalSourceHealthCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SignalSourceHealthFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SignalSourceHealthCountAggregateInputType | true
    }

  export interface SignalSourceHealthDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SignalSourceHealth'], meta: { name: 'SignalSourceHealth' } }
    /**
     * Find zero or one SignalSourceHealth that matches the filter.
     * @param {SignalSourceHealthFindUniqueArgs} args - Arguments to find a SignalSourceHealth
     * @example
     * // Get one SignalSourceHealth
     * const signalSourceHealth = await prisma.signalSourceHealth.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SignalSourceHealthFindUniqueArgs>(args: SelectSubset<T, SignalSourceHealthFindUniqueArgs<ExtArgs>>): Prisma__SignalSourceHealthClient<$Result.GetResult<Prisma.$SignalSourceHealthPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SignalSourceHealth that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SignalSourceHealthFindUniqueOrThrowArgs} args - Arguments to find a SignalSourceHealth
     * @example
     * // Get one SignalSourceHealth
     * const signalSourceHealth = await prisma.signalSourceHealth.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SignalSourceHealthFindUniqueOrThrowArgs>(args: SelectSubset<T, SignalSourceHealthFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SignalSourceHealthClient<$Result.GetResult<Prisma.$SignalSourceHealthPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SignalSourceHealth that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SignalSourceHealthFindFirstArgs} args - Arguments to find a SignalSourceHealth
     * @example
     * // Get one SignalSourceHealth
     * const signalSourceHealth = await prisma.signalSourceHealth.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SignalSourceHealthFindFirstArgs>(args?: SelectSubset<T, SignalSourceHealthFindFirstArgs<ExtArgs>>): Prisma__SignalSourceHealthClient<$Result.GetResult<Prisma.$SignalSourceHealthPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SignalSourceHealth that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SignalSourceHealthFindFirstOrThrowArgs} args - Arguments to find a SignalSourceHealth
     * @example
     * // Get one SignalSourceHealth
     * const signalSourceHealth = await prisma.signalSourceHealth.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SignalSourceHealthFindFirstOrThrowArgs>(args?: SelectSubset<T, SignalSourceHealthFindFirstOrThrowArgs<ExtArgs>>): Prisma__SignalSourceHealthClient<$Result.GetResult<Prisma.$SignalSourceHealthPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SignalSourceHealths that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SignalSourceHealthFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SignalSourceHealths
     * const signalSourceHealths = await prisma.signalSourceHealth.findMany()
     * 
     * // Get first 10 SignalSourceHealths
     * const signalSourceHealths = await prisma.signalSourceHealth.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const signalSourceHealthWithIdOnly = await prisma.signalSourceHealth.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SignalSourceHealthFindManyArgs>(args?: SelectSubset<T, SignalSourceHealthFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SignalSourceHealthPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SignalSourceHealth.
     * @param {SignalSourceHealthCreateArgs} args - Arguments to create a SignalSourceHealth.
     * @example
     * // Create one SignalSourceHealth
     * const SignalSourceHealth = await prisma.signalSourceHealth.create({
     *   data: {
     *     // ... data to create a SignalSourceHealth
     *   }
     * })
     * 
     */
    create<T extends SignalSourceHealthCreateArgs>(args: SelectSubset<T, SignalSourceHealthCreateArgs<ExtArgs>>): Prisma__SignalSourceHealthClient<$Result.GetResult<Prisma.$SignalSourceHealthPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SignalSourceHealths.
     * @param {SignalSourceHealthCreateManyArgs} args - Arguments to create many SignalSourceHealths.
     * @example
     * // Create many SignalSourceHealths
     * const signalSourceHealth = await prisma.signalSourceHealth.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SignalSourceHealthCreateManyArgs>(args?: SelectSubset<T, SignalSourceHealthCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SignalSourceHealths and returns the data saved in the database.
     * @param {SignalSourceHealthCreateManyAndReturnArgs} args - Arguments to create many SignalSourceHealths.
     * @example
     * // Create many SignalSourceHealths
     * const signalSourceHealth = await prisma.signalSourceHealth.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SignalSourceHealths and only return the `id`
     * const signalSourceHealthWithIdOnly = await prisma.signalSourceHealth.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SignalSourceHealthCreateManyAndReturnArgs>(args?: SelectSubset<T, SignalSourceHealthCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SignalSourceHealthPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a SignalSourceHealth.
     * @param {SignalSourceHealthDeleteArgs} args - Arguments to delete one SignalSourceHealth.
     * @example
     * // Delete one SignalSourceHealth
     * const SignalSourceHealth = await prisma.signalSourceHealth.delete({
     *   where: {
     *     // ... filter to delete one SignalSourceHealth
     *   }
     * })
     * 
     */
    delete<T extends SignalSourceHealthDeleteArgs>(args: SelectSubset<T, SignalSourceHealthDeleteArgs<ExtArgs>>): Prisma__SignalSourceHealthClient<$Result.GetResult<Prisma.$SignalSourceHealthPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SignalSourceHealth.
     * @param {SignalSourceHealthUpdateArgs} args - Arguments to update one SignalSourceHealth.
     * @example
     * // Update one SignalSourceHealth
     * const signalSourceHealth = await prisma.signalSourceHealth.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SignalSourceHealthUpdateArgs>(args: SelectSubset<T, SignalSourceHealthUpdateArgs<ExtArgs>>): Prisma__SignalSourceHealthClient<$Result.GetResult<Prisma.$SignalSourceHealthPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SignalSourceHealths.
     * @param {SignalSourceHealthDeleteManyArgs} args - Arguments to filter SignalSourceHealths to delete.
     * @example
     * // Delete a few SignalSourceHealths
     * const { count } = await prisma.signalSourceHealth.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SignalSourceHealthDeleteManyArgs>(args?: SelectSubset<T, SignalSourceHealthDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SignalSourceHealths.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SignalSourceHealthUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SignalSourceHealths
     * const signalSourceHealth = await prisma.signalSourceHealth.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SignalSourceHealthUpdateManyArgs>(args: SelectSubset<T, SignalSourceHealthUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SignalSourceHealth.
     * @param {SignalSourceHealthUpsertArgs} args - Arguments to update or create a SignalSourceHealth.
     * @example
     * // Update or create a SignalSourceHealth
     * const signalSourceHealth = await prisma.signalSourceHealth.upsert({
     *   create: {
     *     // ... data to create a SignalSourceHealth
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SignalSourceHealth we want to update
     *   }
     * })
     */
    upsert<T extends SignalSourceHealthUpsertArgs>(args: SelectSubset<T, SignalSourceHealthUpsertArgs<ExtArgs>>): Prisma__SignalSourceHealthClient<$Result.GetResult<Prisma.$SignalSourceHealthPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of SignalSourceHealths.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SignalSourceHealthCountArgs} args - Arguments to filter SignalSourceHealths to count.
     * @example
     * // Count the number of SignalSourceHealths
     * const count = await prisma.signalSourceHealth.count({
     *   where: {
     *     // ... the filter for the SignalSourceHealths we want to count
     *   }
     * })
    **/
    count<T extends SignalSourceHealthCountArgs>(
      args?: Subset<T, SignalSourceHealthCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SignalSourceHealthCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SignalSourceHealth.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SignalSourceHealthAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SignalSourceHealthAggregateArgs>(args: Subset<T, SignalSourceHealthAggregateArgs>): Prisma.PrismaPromise<GetSignalSourceHealthAggregateType<T>>

    /**
     * Group by SignalSourceHealth.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SignalSourceHealthGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SignalSourceHealthGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SignalSourceHealthGroupByArgs['orderBy'] }
        : { orderBy?: SignalSourceHealthGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SignalSourceHealthGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSignalSourceHealthGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SignalSourceHealth model
   */
  readonly fields: SignalSourceHealthFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SignalSourceHealth.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SignalSourceHealthClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SignalSourceHealth model
   */ 
  interface SignalSourceHealthFieldRefs {
    readonly id: FieldRef<"SignalSourceHealth", 'String'>
    readonly source: FieldRef<"SignalSourceHealth", 'String'>
    readonly status: FieldRef<"SignalSourceHealth", 'String'>
    readonly failureCount: FieldRef<"SignalSourceHealth", 'Int'>
    readonly lastSuccess: FieldRef<"SignalSourceHealth", 'DateTime'>
    readonly lastFailure: FieldRef<"SignalSourceHealth", 'DateTime'>
    readonly cooldownUntil: FieldRef<"SignalSourceHealth", 'DateTime'>
    readonly lastError: FieldRef<"SignalSourceHealth", 'String'>
    readonly createdAt: FieldRef<"SignalSourceHealth", 'DateTime'>
    readonly updatedAt: FieldRef<"SignalSourceHealth", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SignalSourceHealth findUnique
   */
  export type SignalSourceHealthFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SignalSourceHealth
     */
    select?: SignalSourceHealthSelect<ExtArgs> | null
    /**
     * Filter, which SignalSourceHealth to fetch.
     */
    where: SignalSourceHealthWhereUniqueInput
  }

  /**
   * SignalSourceHealth findUniqueOrThrow
   */
  export type SignalSourceHealthFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SignalSourceHealth
     */
    select?: SignalSourceHealthSelect<ExtArgs> | null
    /**
     * Filter, which SignalSourceHealth to fetch.
     */
    where: SignalSourceHealthWhereUniqueInput
  }

  /**
   * SignalSourceHealth findFirst
   */
  export type SignalSourceHealthFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SignalSourceHealth
     */
    select?: SignalSourceHealthSelect<ExtArgs> | null
    /**
     * Filter, which SignalSourceHealth to fetch.
     */
    where?: SignalSourceHealthWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SignalSourceHealths to fetch.
     */
    orderBy?: SignalSourceHealthOrderByWithRelationInput | SignalSourceHealthOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SignalSourceHealths.
     */
    cursor?: SignalSourceHealthWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SignalSourceHealths from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SignalSourceHealths.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SignalSourceHealths.
     */
    distinct?: SignalSourceHealthScalarFieldEnum | SignalSourceHealthScalarFieldEnum[]
  }

  /**
   * SignalSourceHealth findFirstOrThrow
   */
  export type SignalSourceHealthFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SignalSourceHealth
     */
    select?: SignalSourceHealthSelect<ExtArgs> | null
    /**
     * Filter, which SignalSourceHealth to fetch.
     */
    where?: SignalSourceHealthWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SignalSourceHealths to fetch.
     */
    orderBy?: SignalSourceHealthOrderByWithRelationInput | SignalSourceHealthOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SignalSourceHealths.
     */
    cursor?: SignalSourceHealthWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SignalSourceHealths from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SignalSourceHealths.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SignalSourceHealths.
     */
    distinct?: SignalSourceHealthScalarFieldEnum | SignalSourceHealthScalarFieldEnum[]
  }

  /**
   * SignalSourceHealth findMany
   */
  export type SignalSourceHealthFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SignalSourceHealth
     */
    select?: SignalSourceHealthSelect<ExtArgs> | null
    /**
     * Filter, which SignalSourceHealths to fetch.
     */
    where?: SignalSourceHealthWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SignalSourceHealths to fetch.
     */
    orderBy?: SignalSourceHealthOrderByWithRelationInput | SignalSourceHealthOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SignalSourceHealths.
     */
    cursor?: SignalSourceHealthWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SignalSourceHealths from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SignalSourceHealths.
     */
    skip?: number
    distinct?: SignalSourceHealthScalarFieldEnum | SignalSourceHealthScalarFieldEnum[]
  }

  /**
   * SignalSourceHealth create
   */
  export type SignalSourceHealthCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SignalSourceHealth
     */
    select?: SignalSourceHealthSelect<ExtArgs> | null
    /**
     * The data needed to create a SignalSourceHealth.
     */
    data: XOR<SignalSourceHealthCreateInput, SignalSourceHealthUncheckedCreateInput>
  }

  /**
   * SignalSourceHealth createMany
   */
  export type SignalSourceHealthCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SignalSourceHealths.
     */
    data: SignalSourceHealthCreateManyInput | SignalSourceHealthCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SignalSourceHealth createManyAndReturn
   */
  export type SignalSourceHealthCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SignalSourceHealth
     */
    select?: SignalSourceHealthSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SignalSourceHealths.
     */
    data: SignalSourceHealthCreateManyInput | SignalSourceHealthCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SignalSourceHealth update
   */
  export type SignalSourceHealthUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SignalSourceHealth
     */
    select?: SignalSourceHealthSelect<ExtArgs> | null
    /**
     * The data needed to update a SignalSourceHealth.
     */
    data: XOR<SignalSourceHealthUpdateInput, SignalSourceHealthUncheckedUpdateInput>
    /**
     * Choose, which SignalSourceHealth to update.
     */
    where: SignalSourceHealthWhereUniqueInput
  }

  /**
   * SignalSourceHealth updateMany
   */
  export type SignalSourceHealthUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SignalSourceHealths.
     */
    data: XOR<SignalSourceHealthUpdateManyMutationInput, SignalSourceHealthUncheckedUpdateManyInput>
    /**
     * Filter which SignalSourceHealths to update
     */
    where?: SignalSourceHealthWhereInput
  }

  /**
   * SignalSourceHealth upsert
   */
  export type SignalSourceHealthUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SignalSourceHealth
     */
    select?: SignalSourceHealthSelect<ExtArgs> | null
    /**
     * The filter to search for the SignalSourceHealth to update in case it exists.
     */
    where: SignalSourceHealthWhereUniqueInput
    /**
     * In case the SignalSourceHealth found by the `where` argument doesn't exist, create a new SignalSourceHealth with this data.
     */
    create: XOR<SignalSourceHealthCreateInput, SignalSourceHealthUncheckedCreateInput>
    /**
     * In case the SignalSourceHealth was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SignalSourceHealthUpdateInput, SignalSourceHealthUncheckedUpdateInput>
  }

  /**
   * SignalSourceHealth delete
   */
  export type SignalSourceHealthDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SignalSourceHealth
     */
    select?: SignalSourceHealthSelect<ExtArgs> | null
    /**
     * Filter which SignalSourceHealth to delete.
     */
    where: SignalSourceHealthWhereUniqueInput
  }

  /**
   * SignalSourceHealth deleteMany
   */
  export type SignalSourceHealthDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SignalSourceHealths to delete
     */
    where?: SignalSourceHealthWhereInput
  }

  /**
   * SignalSourceHealth without action
   */
  export type SignalSourceHealthDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SignalSourceHealth
     */
    select?: SignalSourceHealthSelect<ExtArgs> | null
  }


  /**
   * Model MerchOutcomeFeedback
   */

  export type AggregateMerchOutcomeFeedback = {
    _count: MerchOutcomeFeedbackCountAggregateOutputType | null
    _avg: MerchOutcomeFeedbackAvgAggregateOutputType | null
    _sum: MerchOutcomeFeedbackSumAggregateOutputType | null
    _min: MerchOutcomeFeedbackMinAggregateOutputType | null
    _max: MerchOutcomeFeedbackMaxAggregateOutputType | null
  }

  export type MerchOutcomeFeedbackAvgAggregateOutputType = {
    impressions: number | null
    clicks: number | null
    orders: number | null
    favorites: number | null
    revenue: number | null
    refunds: number | null
  }

  export type MerchOutcomeFeedbackSumAggregateOutputType = {
    impressions: number | null
    clicks: number | null
    orders: number | null
    favorites: number | null
    revenue: number | null
    refunds: number | null
  }

  export type MerchOutcomeFeedbackMinAggregateOutputType = {
    id: string | null
    userId: string | null
    niche: string | null
    nicheKey: string | null
    platform: string | null
    slogan: string | null
    sloganKey: string | null
    pattern: string | null
    audience: string | null
    style: string | null
    productTitle: string | null
    impressions: number | null
    clicks: number | null
    orders: number | null
    favorites: number | null
    revenue: number | null
    refunds: number | null
    observedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MerchOutcomeFeedbackMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    niche: string | null
    nicheKey: string | null
    platform: string | null
    slogan: string | null
    sloganKey: string | null
    pattern: string | null
    audience: string | null
    style: string | null
    productTitle: string | null
    impressions: number | null
    clicks: number | null
    orders: number | null
    favorites: number | null
    revenue: number | null
    refunds: number | null
    observedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MerchOutcomeFeedbackCountAggregateOutputType = {
    id: number
    userId: number
    niche: number
    nicheKey: number
    platform: number
    slogan: number
    sloganKey: number
    pattern: number
    tags: number
    audience: number
    style: number
    productTitle: number
    visualBatchMetrics: number
    visualStrategyMetrics: number
    visualReleaseGate: number
    impressions: number
    clicks: number
    orders: number
    favorites: number
    revenue: number
    refunds: number
    observedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MerchOutcomeFeedbackAvgAggregateInputType = {
    impressions?: true
    clicks?: true
    orders?: true
    favorites?: true
    revenue?: true
    refunds?: true
  }

  export type MerchOutcomeFeedbackSumAggregateInputType = {
    impressions?: true
    clicks?: true
    orders?: true
    favorites?: true
    revenue?: true
    refunds?: true
  }

  export type MerchOutcomeFeedbackMinAggregateInputType = {
    id?: true
    userId?: true
    niche?: true
    nicheKey?: true
    platform?: true
    slogan?: true
    sloganKey?: true
    pattern?: true
    audience?: true
    style?: true
    productTitle?: true
    impressions?: true
    clicks?: true
    orders?: true
    favorites?: true
    revenue?: true
    refunds?: true
    observedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MerchOutcomeFeedbackMaxAggregateInputType = {
    id?: true
    userId?: true
    niche?: true
    nicheKey?: true
    platform?: true
    slogan?: true
    sloganKey?: true
    pattern?: true
    audience?: true
    style?: true
    productTitle?: true
    impressions?: true
    clicks?: true
    orders?: true
    favorites?: true
    revenue?: true
    refunds?: true
    observedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MerchOutcomeFeedbackCountAggregateInputType = {
    id?: true
    userId?: true
    niche?: true
    nicheKey?: true
    platform?: true
    slogan?: true
    sloganKey?: true
    pattern?: true
    tags?: true
    audience?: true
    style?: true
    productTitle?: true
    visualBatchMetrics?: true
    visualStrategyMetrics?: true
    visualReleaseGate?: true
    impressions?: true
    clicks?: true
    orders?: true
    favorites?: true
    revenue?: true
    refunds?: true
    observedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MerchOutcomeFeedbackAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MerchOutcomeFeedback to aggregate.
     */
    where?: MerchOutcomeFeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MerchOutcomeFeedbacks to fetch.
     */
    orderBy?: MerchOutcomeFeedbackOrderByWithRelationInput | MerchOutcomeFeedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MerchOutcomeFeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MerchOutcomeFeedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MerchOutcomeFeedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MerchOutcomeFeedbacks
    **/
    _count?: true | MerchOutcomeFeedbackCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MerchOutcomeFeedbackAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MerchOutcomeFeedbackSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MerchOutcomeFeedbackMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MerchOutcomeFeedbackMaxAggregateInputType
  }

  export type GetMerchOutcomeFeedbackAggregateType<T extends MerchOutcomeFeedbackAggregateArgs> = {
        [P in keyof T & keyof AggregateMerchOutcomeFeedback]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMerchOutcomeFeedback[P]>
      : GetScalarType<T[P], AggregateMerchOutcomeFeedback[P]>
  }




  export type MerchOutcomeFeedbackGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MerchOutcomeFeedbackWhereInput
    orderBy?: MerchOutcomeFeedbackOrderByWithAggregationInput | MerchOutcomeFeedbackOrderByWithAggregationInput[]
    by: MerchOutcomeFeedbackScalarFieldEnum[] | MerchOutcomeFeedbackScalarFieldEnum
    having?: MerchOutcomeFeedbackScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MerchOutcomeFeedbackCountAggregateInputType | true
    _avg?: MerchOutcomeFeedbackAvgAggregateInputType
    _sum?: MerchOutcomeFeedbackSumAggregateInputType
    _min?: MerchOutcomeFeedbackMinAggregateInputType
    _max?: MerchOutcomeFeedbackMaxAggregateInputType
  }

  export type MerchOutcomeFeedbackGroupByOutputType = {
    id: string
    userId: string
    niche: string
    nicheKey: string
    platform: string
    slogan: string
    sloganKey: string
    pattern: string | null
    tags: string[]
    audience: string | null
    style: string | null
    productTitle: string | null
    visualBatchMetrics: JsonValue | null
    visualStrategyMetrics: JsonValue | null
    visualReleaseGate: JsonValue | null
    impressions: number
    clicks: number
    orders: number
    favorites: number
    revenue: number
    refunds: number
    observedAt: Date
    createdAt: Date
    updatedAt: Date
    _count: MerchOutcomeFeedbackCountAggregateOutputType | null
    _avg: MerchOutcomeFeedbackAvgAggregateOutputType | null
    _sum: MerchOutcomeFeedbackSumAggregateOutputType | null
    _min: MerchOutcomeFeedbackMinAggregateOutputType | null
    _max: MerchOutcomeFeedbackMaxAggregateOutputType | null
  }

  type GetMerchOutcomeFeedbackGroupByPayload<T extends MerchOutcomeFeedbackGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MerchOutcomeFeedbackGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MerchOutcomeFeedbackGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MerchOutcomeFeedbackGroupByOutputType[P]>
            : GetScalarType<T[P], MerchOutcomeFeedbackGroupByOutputType[P]>
        }
      >
    >


  export type MerchOutcomeFeedbackSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    niche?: boolean
    nicheKey?: boolean
    platform?: boolean
    slogan?: boolean
    sloganKey?: boolean
    pattern?: boolean
    tags?: boolean
    audience?: boolean
    style?: boolean
    productTitle?: boolean
    visualBatchMetrics?: boolean
    visualStrategyMetrics?: boolean
    visualReleaseGate?: boolean
    impressions?: boolean
    clicks?: boolean
    orders?: boolean
    favorites?: boolean
    revenue?: boolean
    refunds?: boolean
    observedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["merchOutcomeFeedback"]>

  export type MerchOutcomeFeedbackSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    niche?: boolean
    nicheKey?: boolean
    platform?: boolean
    slogan?: boolean
    sloganKey?: boolean
    pattern?: boolean
    tags?: boolean
    audience?: boolean
    style?: boolean
    productTitle?: boolean
    visualBatchMetrics?: boolean
    visualStrategyMetrics?: boolean
    visualReleaseGate?: boolean
    impressions?: boolean
    clicks?: boolean
    orders?: boolean
    favorites?: boolean
    revenue?: boolean
    refunds?: boolean
    observedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["merchOutcomeFeedback"]>

  export type MerchOutcomeFeedbackSelectScalar = {
    id?: boolean
    userId?: boolean
    niche?: boolean
    nicheKey?: boolean
    platform?: boolean
    slogan?: boolean
    sloganKey?: boolean
    pattern?: boolean
    tags?: boolean
    audience?: boolean
    style?: boolean
    productTitle?: boolean
    visualBatchMetrics?: boolean
    visualStrategyMetrics?: boolean
    visualReleaseGate?: boolean
    impressions?: boolean
    clicks?: boolean
    orders?: boolean
    favorites?: boolean
    revenue?: boolean
    refunds?: boolean
    observedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MerchOutcomeFeedbackInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type MerchOutcomeFeedbackIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $MerchOutcomeFeedbackPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MerchOutcomeFeedback"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      niche: string
      nicheKey: string
      platform: string
      slogan: string
      sloganKey: string
      pattern: string | null
      tags: string[]
      audience: string | null
      style: string | null
      productTitle: string | null
      visualBatchMetrics: Prisma.JsonValue | null
      visualStrategyMetrics: Prisma.JsonValue | null
      visualReleaseGate: Prisma.JsonValue | null
      impressions: number
      clicks: number
      orders: number
      favorites: number
      revenue: number
      refunds: number
      observedAt: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["merchOutcomeFeedback"]>
    composites: {}
  }

  type MerchOutcomeFeedbackGetPayload<S extends boolean | null | undefined | MerchOutcomeFeedbackDefaultArgs> = $Result.GetResult<Prisma.$MerchOutcomeFeedbackPayload, S>

  type MerchOutcomeFeedbackCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<MerchOutcomeFeedbackFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: MerchOutcomeFeedbackCountAggregateInputType | true
    }

  export interface MerchOutcomeFeedbackDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MerchOutcomeFeedback'], meta: { name: 'MerchOutcomeFeedback' } }
    /**
     * Find zero or one MerchOutcomeFeedback that matches the filter.
     * @param {MerchOutcomeFeedbackFindUniqueArgs} args - Arguments to find a MerchOutcomeFeedback
     * @example
     * // Get one MerchOutcomeFeedback
     * const merchOutcomeFeedback = await prisma.merchOutcomeFeedback.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MerchOutcomeFeedbackFindUniqueArgs>(args: SelectSubset<T, MerchOutcomeFeedbackFindUniqueArgs<ExtArgs>>): Prisma__MerchOutcomeFeedbackClient<$Result.GetResult<Prisma.$MerchOutcomeFeedbackPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one MerchOutcomeFeedback that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {MerchOutcomeFeedbackFindUniqueOrThrowArgs} args - Arguments to find a MerchOutcomeFeedback
     * @example
     * // Get one MerchOutcomeFeedback
     * const merchOutcomeFeedback = await prisma.merchOutcomeFeedback.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MerchOutcomeFeedbackFindUniqueOrThrowArgs>(args: SelectSubset<T, MerchOutcomeFeedbackFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MerchOutcomeFeedbackClient<$Result.GetResult<Prisma.$MerchOutcomeFeedbackPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first MerchOutcomeFeedback that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MerchOutcomeFeedbackFindFirstArgs} args - Arguments to find a MerchOutcomeFeedback
     * @example
     * // Get one MerchOutcomeFeedback
     * const merchOutcomeFeedback = await prisma.merchOutcomeFeedback.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MerchOutcomeFeedbackFindFirstArgs>(args?: SelectSubset<T, MerchOutcomeFeedbackFindFirstArgs<ExtArgs>>): Prisma__MerchOutcomeFeedbackClient<$Result.GetResult<Prisma.$MerchOutcomeFeedbackPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first MerchOutcomeFeedback that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MerchOutcomeFeedbackFindFirstOrThrowArgs} args - Arguments to find a MerchOutcomeFeedback
     * @example
     * // Get one MerchOutcomeFeedback
     * const merchOutcomeFeedback = await prisma.merchOutcomeFeedback.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MerchOutcomeFeedbackFindFirstOrThrowArgs>(args?: SelectSubset<T, MerchOutcomeFeedbackFindFirstOrThrowArgs<ExtArgs>>): Prisma__MerchOutcomeFeedbackClient<$Result.GetResult<Prisma.$MerchOutcomeFeedbackPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more MerchOutcomeFeedbacks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MerchOutcomeFeedbackFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MerchOutcomeFeedbacks
     * const merchOutcomeFeedbacks = await prisma.merchOutcomeFeedback.findMany()
     * 
     * // Get first 10 MerchOutcomeFeedbacks
     * const merchOutcomeFeedbacks = await prisma.merchOutcomeFeedback.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const merchOutcomeFeedbackWithIdOnly = await prisma.merchOutcomeFeedback.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MerchOutcomeFeedbackFindManyArgs>(args?: SelectSubset<T, MerchOutcomeFeedbackFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MerchOutcomeFeedbackPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a MerchOutcomeFeedback.
     * @param {MerchOutcomeFeedbackCreateArgs} args - Arguments to create a MerchOutcomeFeedback.
     * @example
     * // Create one MerchOutcomeFeedback
     * const MerchOutcomeFeedback = await prisma.merchOutcomeFeedback.create({
     *   data: {
     *     // ... data to create a MerchOutcomeFeedback
     *   }
     * })
     * 
     */
    create<T extends MerchOutcomeFeedbackCreateArgs>(args: SelectSubset<T, MerchOutcomeFeedbackCreateArgs<ExtArgs>>): Prisma__MerchOutcomeFeedbackClient<$Result.GetResult<Prisma.$MerchOutcomeFeedbackPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many MerchOutcomeFeedbacks.
     * @param {MerchOutcomeFeedbackCreateManyArgs} args - Arguments to create many MerchOutcomeFeedbacks.
     * @example
     * // Create many MerchOutcomeFeedbacks
     * const merchOutcomeFeedback = await prisma.merchOutcomeFeedback.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MerchOutcomeFeedbackCreateManyArgs>(args?: SelectSubset<T, MerchOutcomeFeedbackCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MerchOutcomeFeedbacks and returns the data saved in the database.
     * @param {MerchOutcomeFeedbackCreateManyAndReturnArgs} args - Arguments to create many MerchOutcomeFeedbacks.
     * @example
     * // Create many MerchOutcomeFeedbacks
     * const merchOutcomeFeedback = await prisma.merchOutcomeFeedback.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MerchOutcomeFeedbacks and only return the `id`
     * const merchOutcomeFeedbackWithIdOnly = await prisma.merchOutcomeFeedback.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MerchOutcomeFeedbackCreateManyAndReturnArgs>(args?: SelectSubset<T, MerchOutcomeFeedbackCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MerchOutcomeFeedbackPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a MerchOutcomeFeedback.
     * @param {MerchOutcomeFeedbackDeleteArgs} args - Arguments to delete one MerchOutcomeFeedback.
     * @example
     * // Delete one MerchOutcomeFeedback
     * const MerchOutcomeFeedback = await prisma.merchOutcomeFeedback.delete({
     *   where: {
     *     // ... filter to delete one MerchOutcomeFeedback
     *   }
     * })
     * 
     */
    delete<T extends MerchOutcomeFeedbackDeleteArgs>(args: SelectSubset<T, MerchOutcomeFeedbackDeleteArgs<ExtArgs>>): Prisma__MerchOutcomeFeedbackClient<$Result.GetResult<Prisma.$MerchOutcomeFeedbackPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one MerchOutcomeFeedback.
     * @param {MerchOutcomeFeedbackUpdateArgs} args - Arguments to update one MerchOutcomeFeedback.
     * @example
     * // Update one MerchOutcomeFeedback
     * const merchOutcomeFeedback = await prisma.merchOutcomeFeedback.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MerchOutcomeFeedbackUpdateArgs>(args: SelectSubset<T, MerchOutcomeFeedbackUpdateArgs<ExtArgs>>): Prisma__MerchOutcomeFeedbackClient<$Result.GetResult<Prisma.$MerchOutcomeFeedbackPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more MerchOutcomeFeedbacks.
     * @param {MerchOutcomeFeedbackDeleteManyArgs} args - Arguments to filter MerchOutcomeFeedbacks to delete.
     * @example
     * // Delete a few MerchOutcomeFeedbacks
     * const { count } = await prisma.merchOutcomeFeedback.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MerchOutcomeFeedbackDeleteManyArgs>(args?: SelectSubset<T, MerchOutcomeFeedbackDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MerchOutcomeFeedbacks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MerchOutcomeFeedbackUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MerchOutcomeFeedbacks
     * const merchOutcomeFeedback = await prisma.merchOutcomeFeedback.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MerchOutcomeFeedbackUpdateManyArgs>(args: SelectSubset<T, MerchOutcomeFeedbackUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one MerchOutcomeFeedback.
     * @param {MerchOutcomeFeedbackUpsertArgs} args - Arguments to update or create a MerchOutcomeFeedback.
     * @example
     * // Update or create a MerchOutcomeFeedback
     * const merchOutcomeFeedback = await prisma.merchOutcomeFeedback.upsert({
     *   create: {
     *     // ... data to create a MerchOutcomeFeedback
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MerchOutcomeFeedback we want to update
     *   }
     * })
     */
    upsert<T extends MerchOutcomeFeedbackUpsertArgs>(args: SelectSubset<T, MerchOutcomeFeedbackUpsertArgs<ExtArgs>>): Prisma__MerchOutcomeFeedbackClient<$Result.GetResult<Prisma.$MerchOutcomeFeedbackPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of MerchOutcomeFeedbacks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MerchOutcomeFeedbackCountArgs} args - Arguments to filter MerchOutcomeFeedbacks to count.
     * @example
     * // Count the number of MerchOutcomeFeedbacks
     * const count = await prisma.merchOutcomeFeedback.count({
     *   where: {
     *     // ... the filter for the MerchOutcomeFeedbacks we want to count
     *   }
     * })
    **/
    count<T extends MerchOutcomeFeedbackCountArgs>(
      args?: Subset<T, MerchOutcomeFeedbackCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MerchOutcomeFeedbackCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MerchOutcomeFeedback.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MerchOutcomeFeedbackAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MerchOutcomeFeedbackAggregateArgs>(args: Subset<T, MerchOutcomeFeedbackAggregateArgs>): Prisma.PrismaPromise<GetMerchOutcomeFeedbackAggregateType<T>>

    /**
     * Group by MerchOutcomeFeedback.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MerchOutcomeFeedbackGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MerchOutcomeFeedbackGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MerchOutcomeFeedbackGroupByArgs['orderBy'] }
        : { orderBy?: MerchOutcomeFeedbackGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MerchOutcomeFeedbackGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMerchOutcomeFeedbackGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MerchOutcomeFeedback model
   */
  readonly fields: MerchOutcomeFeedbackFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MerchOutcomeFeedback.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MerchOutcomeFeedbackClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MerchOutcomeFeedback model
   */ 
  interface MerchOutcomeFeedbackFieldRefs {
    readonly id: FieldRef<"MerchOutcomeFeedback", 'String'>
    readonly userId: FieldRef<"MerchOutcomeFeedback", 'String'>
    readonly niche: FieldRef<"MerchOutcomeFeedback", 'String'>
    readonly nicheKey: FieldRef<"MerchOutcomeFeedback", 'String'>
    readonly platform: FieldRef<"MerchOutcomeFeedback", 'String'>
    readonly slogan: FieldRef<"MerchOutcomeFeedback", 'String'>
    readonly sloganKey: FieldRef<"MerchOutcomeFeedback", 'String'>
    readonly pattern: FieldRef<"MerchOutcomeFeedback", 'String'>
    readonly tags: FieldRef<"MerchOutcomeFeedback", 'String[]'>
    readonly audience: FieldRef<"MerchOutcomeFeedback", 'String'>
    readonly style: FieldRef<"MerchOutcomeFeedback", 'String'>
    readonly productTitle: FieldRef<"MerchOutcomeFeedback", 'String'>
    readonly visualBatchMetrics: FieldRef<"MerchOutcomeFeedback", 'Json'>
    readonly visualStrategyMetrics: FieldRef<"MerchOutcomeFeedback", 'Json'>
    readonly visualReleaseGate: FieldRef<"MerchOutcomeFeedback", 'Json'>
    readonly impressions: FieldRef<"MerchOutcomeFeedback", 'Int'>
    readonly clicks: FieldRef<"MerchOutcomeFeedback", 'Int'>
    readonly orders: FieldRef<"MerchOutcomeFeedback", 'Int'>
    readonly favorites: FieldRef<"MerchOutcomeFeedback", 'Int'>
    readonly revenue: FieldRef<"MerchOutcomeFeedback", 'Float'>
    readonly refunds: FieldRef<"MerchOutcomeFeedback", 'Int'>
    readonly observedAt: FieldRef<"MerchOutcomeFeedback", 'DateTime'>
    readonly createdAt: FieldRef<"MerchOutcomeFeedback", 'DateTime'>
    readonly updatedAt: FieldRef<"MerchOutcomeFeedback", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MerchOutcomeFeedback findUnique
   */
  export type MerchOutcomeFeedbackFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchOutcomeFeedback
     */
    select?: MerchOutcomeFeedbackSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchOutcomeFeedbackInclude<ExtArgs> | null
    /**
     * Filter, which MerchOutcomeFeedback to fetch.
     */
    where: MerchOutcomeFeedbackWhereUniqueInput
  }

  /**
   * MerchOutcomeFeedback findUniqueOrThrow
   */
  export type MerchOutcomeFeedbackFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchOutcomeFeedback
     */
    select?: MerchOutcomeFeedbackSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchOutcomeFeedbackInclude<ExtArgs> | null
    /**
     * Filter, which MerchOutcomeFeedback to fetch.
     */
    where: MerchOutcomeFeedbackWhereUniqueInput
  }

  /**
   * MerchOutcomeFeedback findFirst
   */
  export type MerchOutcomeFeedbackFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchOutcomeFeedback
     */
    select?: MerchOutcomeFeedbackSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchOutcomeFeedbackInclude<ExtArgs> | null
    /**
     * Filter, which MerchOutcomeFeedback to fetch.
     */
    where?: MerchOutcomeFeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MerchOutcomeFeedbacks to fetch.
     */
    orderBy?: MerchOutcomeFeedbackOrderByWithRelationInput | MerchOutcomeFeedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MerchOutcomeFeedbacks.
     */
    cursor?: MerchOutcomeFeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MerchOutcomeFeedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MerchOutcomeFeedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MerchOutcomeFeedbacks.
     */
    distinct?: MerchOutcomeFeedbackScalarFieldEnum | MerchOutcomeFeedbackScalarFieldEnum[]
  }

  /**
   * MerchOutcomeFeedback findFirstOrThrow
   */
  export type MerchOutcomeFeedbackFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchOutcomeFeedback
     */
    select?: MerchOutcomeFeedbackSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchOutcomeFeedbackInclude<ExtArgs> | null
    /**
     * Filter, which MerchOutcomeFeedback to fetch.
     */
    where?: MerchOutcomeFeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MerchOutcomeFeedbacks to fetch.
     */
    orderBy?: MerchOutcomeFeedbackOrderByWithRelationInput | MerchOutcomeFeedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MerchOutcomeFeedbacks.
     */
    cursor?: MerchOutcomeFeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MerchOutcomeFeedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MerchOutcomeFeedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MerchOutcomeFeedbacks.
     */
    distinct?: MerchOutcomeFeedbackScalarFieldEnum | MerchOutcomeFeedbackScalarFieldEnum[]
  }

  /**
   * MerchOutcomeFeedback findMany
   */
  export type MerchOutcomeFeedbackFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchOutcomeFeedback
     */
    select?: MerchOutcomeFeedbackSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchOutcomeFeedbackInclude<ExtArgs> | null
    /**
     * Filter, which MerchOutcomeFeedbacks to fetch.
     */
    where?: MerchOutcomeFeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MerchOutcomeFeedbacks to fetch.
     */
    orderBy?: MerchOutcomeFeedbackOrderByWithRelationInput | MerchOutcomeFeedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MerchOutcomeFeedbacks.
     */
    cursor?: MerchOutcomeFeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MerchOutcomeFeedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MerchOutcomeFeedbacks.
     */
    skip?: number
    distinct?: MerchOutcomeFeedbackScalarFieldEnum | MerchOutcomeFeedbackScalarFieldEnum[]
  }

  /**
   * MerchOutcomeFeedback create
   */
  export type MerchOutcomeFeedbackCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchOutcomeFeedback
     */
    select?: MerchOutcomeFeedbackSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchOutcomeFeedbackInclude<ExtArgs> | null
    /**
     * The data needed to create a MerchOutcomeFeedback.
     */
    data: XOR<MerchOutcomeFeedbackCreateInput, MerchOutcomeFeedbackUncheckedCreateInput>
  }

  /**
   * MerchOutcomeFeedback createMany
   */
  export type MerchOutcomeFeedbackCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MerchOutcomeFeedbacks.
     */
    data: MerchOutcomeFeedbackCreateManyInput | MerchOutcomeFeedbackCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MerchOutcomeFeedback createManyAndReturn
   */
  export type MerchOutcomeFeedbackCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchOutcomeFeedback
     */
    select?: MerchOutcomeFeedbackSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many MerchOutcomeFeedbacks.
     */
    data: MerchOutcomeFeedbackCreateManyInput | MerchOutcomeFeedbackCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchOutcomeFeedbackIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MerchOutcomeFeedback update
   */
  export type MerchOutcomeFeedbackUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchOutcomeFeedback
     */
    select?: MerchOutcomeFeedbackSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchOutcomeFeedbackInclude<ExtArgs> | null
    /**
     * The data needed to update a MerchOutcomeFeedback.
     */
    data: XOR<MerchOutcomeFeedbackUpdateInput, MerchOutcomeFeedbackUncheckedUpdateInput>
    /**
     * Choose, which MerchOutcomeFeedback to update.
     */
    where: MerchOutcomeFeedbackWhereUniqueInput
  }

  /**
   * MerchOutcomeFeedback updateMany
   */
  export type MerchOutcomeFeedbackUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MerchOutcomeFeedbacks.
     */
    data: XOR<MerchOutcomeFeedbackUpdateManyMutationInput, MerchOutcomeFeedbackUncheckedUpdateManyInput>
    /**
     * Filter which MerchOutcomeFeedbacks to update
     */
    where?: MerchOutcomeFeedbackWhereInput
  }

  /**
   * MerchOutcomeFeedback upsert
   */
  export type MerchOutcomeFeedbackUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchOutcomeFeedback
     */
    select?: MerchOutcomeFeedbackSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchOutcomeFeedbackInclude<ExtArgs> | null
    /**
     * The filter to search for the MerchOutcomeFeedback to update in case it exists.
     */
    where: MerchOutcomeFeedbackWhereUniqueInput
    /**
     * In case the MerchOutcomeFeedback found by the `where` argument doesn't exist, create a new MerchOutcomeFeedback with this data.
     */
    create: XOR<MerchOutcomeFeedbackCreateInput, MerchOutcomeFeedbackUncheckedCreateInput>
    /**
     * In case the MerchOutcomeFeedback was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MerchOutcomeFeedbackUpdateInput, MerchOutcomeFeedbackUncheckedUpdateInput>
  }

  /**
   * MerchOutcomeFeedback delete
   */
  export type MerchOutcomeFeedbackDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchOutcomeFeedback
     */
    select?: MerchOutcomeFeedbackSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchOutcomeFeedbackInclude<ExtArgs> | null
    /**
     * Filter which MerchOutcomeFeedback to delete.
     */
    where: MerchOutcomeFeedbackWhereUniqueInput
  }

  /**
   * MerchOutcomeFeedback deleteMany
   */
  export type MerchOutcomeFeedbackDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MerchOutcomeFeedbacks to delete
     */
    where?: MerchOutcomeFeedbackWhereInput
  }

  /**
   * MerchOutcomeFeedback without action
   */
  export type MerchOutcomeFeedbackDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchOutcomeFeedback
     */
    select?: MerchOutcomeFeedbackSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchOutcomeFeedbackInclude<ExtArgs> | null
  }


  /**
   * Model SloganPattern
   */

  export type AggregateSloganPattern = {
    _count: SloganPatternCountAggregateOutputType | null
    _avg: SloganPatternAvgAggregateOutputType | null
    _sum: SloganPatternSumAggregateOutputType | null
    _min: SloganPatternMinAggregateOutputType | null
    _max: SloganPatternMaxAggregateOutputType | null
  }

  export type SloganPatternAvgAggregateOutputType = {
    score: number | null
    uses: number | null
    impressions: number | null
    clicks: number | null
    sales: number | null
    ctr: number | null
    conversion: number | null
  }

  export type SloganPatternSumAggregateOutputType = {
    score: number | null
    uses: number | null
    impressions: number | null
    clicks: number | null
    sales: number | null
    ctr: number | null
    conversion: number | null
  }

  export type SloganPatternMinAggregateOutputType = {
    id: string | null
    niche: string | null
    pattern: string | null
    score: number | null
    uses: number | null
    impressions: number | null
    clicks: number | null
    sales: number | null
    ctr: number | null
    conversion: number | null
    lastSlogan: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SloganPatternMaxAggregateOutputType = {
    id: string | null
    niche: string | null
    pattern: string | null
    score: number | null
    uses: number | null
    impressions: number | null
    clicks: number | null
    sales: number | null
    ctr: number | null
    conversion: number | null
    lastSlogan: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SloganPatternCountAggregateOutputType = {
    id: number
    niche: number
    pattern: number
    score: number
    uses: number
    impressions: number
    clicks: number
    sales: number
    ctr: number
    conversion: number
    lastSlogan: number
    nicheHints: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SloganPatternAvgAggregateInputType = {
    score?: true
    uses?: true
    impressions?: true
    clicks?: true
    sales?: true
    ctr?: true
    conversion?: true
  }

  export type SloganPatternSumAggregateInputType = {
    score?: true
    uses?: true
    impressions?: true
    clicks?: true
    sales?: true
    ctr?: true
    conversion?: true
  }

  export type SloganPatternMinAggregateInputType = {
    id?: true
    niche?: true
    pattern?: true
    score?: true
    uses?: true
    impressions?: true
    clicks?: true
    sales?: true
    ctr?: true
    conversion?: true
    lastSlogan?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SloganPatternMaxAggregateInputType = {
    id?: true
    niche?: true
    pattern?: true
    score?: true
    uses?: true
    impressions?: true
    clicks?: true
    sales?: true
    ctr?: true
    conversion?: true
    lastSlogan?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SloganPatternCountAggregateInputType = {
    id?: true
    niche?: true
    pattern?: true
    score?: true
    uses?: true
    impressions?: true
    clicks?: true
    sales?: true
    ctr?: true
    conversion?: true
    lastSlogan?: true
    nicheHints?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SloganPatternAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SloganPattern to aggregate.
     */
    where?: SloganPatternWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SloganPatterns to fetch.
     */
    orderBy?: SloganPatternOrderByWithRelationInput | SloganPatternOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SloganPatternWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SloganPatterns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SloganPatterns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SloganPatterns
    **/
    _count?: true | SloganPatternCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SloganPatternAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SloganPatternSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SloganPatternMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SloganPatternMaxAggregateInputType
  }

  export type GetSloganPatternAggregateType<T extends SloganPatternAggregateArgs> = {
        [P in keyof T & keyof AggregateSloganPattern]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSloganPattern[P]>
      : GetScalarType<T[P], AggregateSloganPattern[P]>
  }




  export type SloganPatternGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SloganPatternWhereInput
    orderBy?: SloganPatternOrderByWithAggregationInput | SloganPatternOrderByWithAggregationInput[]
    by: SloganPatternScalarFieldEnum[] | SloganPatternScalarFieldEnum
    having?: SloganPatternScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SloganPatternCountAggregateInputType | true
    _avg?: SloganPatternAvgAggregateInputType
    _sum?: SloganPatternSumAggregateInputType
    _min?: SloganPatternMinAggregateInputType
    _max?: SloganPatternMaxAggregateInputType
  }

  export type SloganPatternGroupByOutputType = {
    id: string
    niche: string
    pattern: string
    score: number
    uses: number
    impressions: number
    clicks: number
    sales: number
    ctr: number
    conversion: number
    lastSlogan: string | null
    nicheHints: string[]
    createdAt: Date
    updatedAt: Date
    _count: SloganPatternCountAggregateOutputType | null
    _avg: SloganPatternAvgAggregateOutputType | null
    _sum: SloganPatternSumAggregateOutputType | null
    _min: SloganPatternMinAggregateOutputType | null
    _max: SloganPatternMaxAggregateOutputType | null
  }

  type GetSloganPatternGroupByPayload<T extends SloganPatternGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SloganPatternGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SloganPatternGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SloganPatternGroupByOutputType[P]>
            : GetScalarType<T[P], SloganPatternGroupByOutputType[P]>
        }
      >
    >


  export type SloganPatternSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    niche?: boolean
    pattern?: boolean
    score?: boolean
    uses?: boolean
    impressions?: boolean
    clicks?: boolean
    sales?: boolean
    ctr?: boolean
    conversion?: boolean
    lastSlogan?: boolean
    nicheHints?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["sloganPattern"]>

  export type SloganPatternSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    niche?: boolean
    pattern?: boolean
    score?: boolean
    uses?: boolean
    impressions?: boolean
    clicks?: boolean
    sales?: boolean
    ctr?: boolean
    conversion?: boolean
    lastSlogan?: boolean
    nicheHints?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["sloganPattern"]>

  export type SloganPatternSelectScalar = {
    id?: boolean
    niche?: boolean
    pattern?: boolean
    score?: boolean
    uses?: boolean
    impressions?: boolean
    clicks?: boolean
    sales?: boolean
    ctr?: boolean
    conversion?: boolean
    lastSlogan?: boolean
    nicheHints?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $SloganPatternPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SloganPattern"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      niche: string
      pattern: string
      score: number
      uses: number
      impressions: number
      clicks: number
      sales: number
      ctr: number
      conversion: number
      lastSlogan: string | null
      nicheHints: string[]
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["sloganPattern"]>
    composites: {}
  }

  type SloganPatternGetPayload<S extends boolean | null | undefined | SloganPatternDefaultArgs> = $Result.GetResult<Prisma.$SloganPatternPayload, S>

  type SloganPatternCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SloganPatternFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SloganPatternCountAggregateInputType | true
    }

  export interface SloganPatternDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SloganPattern'], meta: { name: 'SloganPattern' } }
    /**
     * Find zero or one SloganPattern that matches the filter.
     * @param {SloganPatternFindUniqueArgs} args - Arguments to find a SloganPattern
     * @example
     * // Get one SloganPattern
     * const sloganPattern = await prisma.sloganPattern.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SloganPatternFindUniqueArgs>(args: SelectSubset<T, SloganPatternFindUniqueArgs<ExtArgs>>): Prisma__SloganPatternClient<$Result.GetResult<Prisma.$SloganPatternPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SloganPattern that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SloganPatternFindUniqueOrThrowArgs} args - Arguments to find a SloganPattern
     * @example
     * // Get one SloganPattern
     * const sloganPattern = await prisma.sloganPattern.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SloganPatternFindUniqueOrThrowArgs>(args: SelectSubset<T, SloganPatternFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SloganPatternClient<$Result.GetResult<Prisma.$SloganPatternPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SloganPattern that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SloganPatternFindFirstArgs} args - Arguments to find a SloganPattern
     * @example
     * // Get one SloganPattern
     * const sloganPattern = await prisma.sloganPattern.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SloganPatternFindFirstArgs>(args?: SelectSubset<T, SloganPatternFindFirstArgs<ExtArgs>>): Prisma__SloganPatternClient<$Result.GetResult<Prisma.$SloganPatternPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SloganPattern that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SloganPatternFindFirstOrThrowArgs} args - Arguments to find a SloganPattern
     * @example
     * // Get one SloganPattern
     * const sloganPattern = await prisma.sloganPattern.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SloganPatternFindFirstOrThrowArgs>(args?: SelectSubset<T, SloganPatternFindFirstOrThrowArgs<ExtArgs>>): Prisma__SloganPatternClient<$Result.GetResult<Prisma.$SloganPatternPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SloganPatterns that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SloganPatternFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SloganPatterns
     * const sloganPatterns = await prisma.sloganPattern.findMany()
     * 
     * // Get first 10 SloganPatterns
     * const sloganPatterns = await prisma.sloganPattern.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sloganPatternWithIdOnly = await prisma.sloganPattern.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SloganPatternFindManyArgs>(args?: SelectSubset<T, SloganPatternFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SloganPatternPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SloganPattern.
     * @param {SloganPatternCreateArgs} args - Arguments to create a SloganPattern.
     * @example
     * // Create one SloganPattern
     * const SloganPattern = await prisma.sloganPattern.create({
     *   data: {
     *     // ... data to create a SloganPattern
     *   }
     * })
     * 
     */
    create<T extends SloganPatternCreateArgs>(args: SelectSubset<T, SloganPatternCreateArgs<ExtArgs>>): Prisma__SloganPatternClient<$Result.GetResult<Prisma.$SloganPatternPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SloganPatterns.
     * @param {SloganPatternCreateManyArgs} args - Arguments to create many SloganPatterns.
     * @example
     * // Create many SloganPatterns
     * const sloganPattern = await prisma.sloganPattern.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SloganPatternCreateManyArgs>(args?: SelectSubset<T, SloganPatternCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SloganPatterns and returns the data saved in the database.
     * @param {SloganPatternCreateManyAndReturnArgs} args - Arguments to create many SloganPatterns.
     * @example
     * // Create many SloganPatterns
     * const sloganPattern = await prisma.sloganPattern.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SloganPatterns and only return the `id`
     * const sloganPatternWithIdOnly = await prisma.sloganPattern.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SloganPatternCreateManyAndReturnArgs>(args?: SelectSubset<T, SloganPatternCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SloganPatternPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a SloganPattern.
     * @param {SloganPatternDeleteArgs} args - Arguments to delete one SloganPattern.
     * @example
     * // Delete one SloganPattern
     * const SloganPattern = await prisma.sloganPattern.delete({
     *   where: {
     *     // ... filter to delete one SloganPattern
     *   }
     * })
     * 
     */
    delete<T extends SloganPatternDeleteArgs>(args: SelectSubset<T, SloganPatternDeleteArgs<ExtArgs>>): Prisma__SloganPatternClient<$Result.GetResult<Prisma.$SloganPatternPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SloganPattern.
     * @param {SloganPatternUpdateArgs} args - Arguments to update one SloganPattern.
     * @example
     * // Update one SloganPattern
     * const sloganPattern = await prisma.sloganPattern.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SloganPatternUpdateArgs>(args: SelectSubset<T, SloganPatternUpdateArgs<ExtArgs>>): Prisma__SloganPatternClient<$Result.GetResult<Prisma.$SloganPatternPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SloganPatterns.
     * @param {SloganPatternDeleteManyArgs} args - Arguments to filter SloganPatterns to delete.
     * @example
     * // Delete a few SloganPatterns
     * const { count } = await prisma.sloganPattern.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SloganPatternDeleteManyArgs>(args?: SelectSubset<T, SloganPatternDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SloganPatterns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SloganPatternUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SloganPatterns
     * const sloganPattern = await prisma.sloganPattern.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SloganPatternUpdateManyArgs>(args: SelectSubset<T, SloganPatternUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SloganPattern.
     * @param {SloganPatternUpsertArgs} args - Arguments to update or create a SloganPattern.
     * @example
     * // Update or create a SloganPattern
     * const sloganPattern = await prisma.sloganPattern.upsert({
     *   create: {
     *     // ... data to create a SloganPattern
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SloganPattern we want to update
     *   }
     * })
     */
    upsert<T extends SloganPatternUpsertArgs>(args: SelectSubset<T, SloganPatternUpsertArgs<ExtArgs>>): Prisma__SloganPatternClient<$Result.GetResult<Prisma.$SloganPatternPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of SloganPatterns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SloganPatternCountArgs} args - Arguments to filter SloganPatterns to count.
     * @example
     * // Count the number of SloganPatterns
     * const count = await prisma.sloganPattern.count({
     *   where: {
     *     // ... the filter for the SloganPatterns we want to count
     *   }
     * })
    **/
    count<T extends SloganPatternCountArgs>(
      args?: Subset<T, SloganPatternCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SloganPatternCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SloganPattern.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SloganPatternAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SloganPatternAggregateArgs>(args: Subset<T, SloganPatternAggregateArgs>): Prisma.PrismaPromise<GetSloganPatternAggregateType<T>>

    /**
     * Group by SloganPattern.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SloganPatternGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SloganPatternGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SloganPatternGroupByArgs['orderBy'] }
        : { orderBy?: SloganPatternGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SloganPatternGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSloganPatternGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SloganPattern model
   */
  readonly fields: SloganPatternFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SloganPattern.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SloganPatternClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SloganPattern model
   */ 
  interface SloganPatternFieldRefs {
    readonly id: FieldRef<"SloganPattern", 'String'>
    readonly niche: FieldRef<"SloganPattern", 'String'>
    readonly pattern: FieldRef<"SloganPattern", 'String'>
    readonly score: FieldRef<"SloganPattern", 'Float'>
    readonly uses: FieldRef<"SloganPattern", 'Int'>
    readonly impressions: FieldRef<"SloganPattern", 'Int'>
    readonly clicks: FieldRef<"SloganPattern", 'Int'>
    readonly sales: FieldRef<"SloganPattern", 'Int'>
    readonly ctr: FieldRef<"SloganPattern", 'Float'>
    readonly conversion: FieldRef<"SloganPattern", 'Float'>
    readonly lastSlogan: FieldRef<"SloganPattern", 'String'>
    readonly nicheHints: FieldRef<"SloganPattern", 'String[]'>
    readonly createdAt: FieldRef<"SloganPattern", 'DateTime'>
    readonly updatedAt: FieldRef<"SloganPattern", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SloganPattern findUnique
   */
  export type SloganPatternFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SloganPattern
     */
    select?: SloganPatternSelect<ExtArgs> | null
    /**
     * Filter, which SloganPattern to fetch.
     */
    where: SloganPatternWhereUniqueInput
  }

  /**
   * SloganPattern findUniqueOrThrow
   */
  export type SloganPatternFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SloganPattern
     */
    select?: SloganPatternSelect<ExtArgs> | null
    /**
     * Filter, which SloganPattern to fetch.
     */
    where: SloganPatternWhereUniqueInput
  }

  /**
   * SloganPattern findFirst
   */
  export type SloganPatternFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SloganPattern
     */
    select?: SloganPatternSelect<ExtArgs> | null
    /**
     * Filter, which SloganPattern to fetch.
     */
    where?: SloganPatternWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SloganPatterns to fetch.
     */
    orderBy?: SloganPatternOrderByWithRelationInput | SloganPatternOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SloganPatterns.
     */
    cursor?: SloganPatternWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SloganPatterns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SloganPatterns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SloganPatterns.
     */
    distinct?: SloganPatternScalarFieldEnum | SloganPatternScalarFieldEnum[]
  }

  /**
   * SloganPattern findFirstOrThrow
   */
  export type SloganPatternFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SloganPattern
     */
    select?: SloganPatternSelect<ExtArgs> | null
    /**
     * Filter, which SloganPattern to fetch.
     */
    where?: SloganPatternWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SloganPatterns to fetch.
     */
    orderBy?: SloganPatternOrderByWithRelationInput | SloganPatternOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SloganPatterns.
     */
    cursor?: SloganPatternWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SloganPatterns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SloganPatterns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SloganPatterns.
     */
    distinct?: SloganPatternScalarFieldEnum | SloganPatternScalarFieldEnum[]
  }

  /**
   * SloganPattern findMany
   */
  export type SloganPatternFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SloganPattern
     */
    select?: SloganPatternSelect<ExtArgs> | null
    /**
     * Filter, which SloganPatterns to fetch.
     */
    where?: SloganPatternWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SloganPatterns to fetch.
     */
    orderBy?: SloganPatternOrderByWithRelationInput | SloganPatternOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SloganPatterns.
     */
    cursor?: SloganPatternWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SloganPatterns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SloganPatterns.
     */
    skip?: number
    distinct?: SloganPatternScalarFieldEnum | SloganPatternScalarFieldEnum[]
  }

  /**
   * SloganPattern create
   */
  export type SloganPatternCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SloganPattern
     */
    select?: SloganPatternSelect<ExtArgs> | null
    /**
     * The data needed to create a SloganPattern.
     */
    data: XOR<SloganPatternCreateInput, SloganPatternUncheckedCreateInput>
  }

  /**
   * SloganPattern createMany
   */
  export type SloganPatternCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SloganPatterns.
     */
    data: SloganPatternCreateManyInput | SloganPatternCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SloganPattern createManyAndReturn
   */
  export type SloganPatternCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SloganPattern
     */
    select?: SloganPatternSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SloganPatterns.
     */
    data: SloganPatternCreateManyInput | SloganPatternCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SloganPattern update
   */
  export type SloganPatternUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SloganPattern
     */
    select?: SloganPatternSelect<ExtArgs> | null
    /**
     * The data needed to update a SloganPattern.
     */
    data: XOR<SloganPatternUpdateInput, SloganPatternUncheckedUpdateInput>
    /**
     * Choose, which SloganPattern to update.
     */
    where: SloganPatternWhereUniqueInput
  }

  /**
   * SloganPattern updateMany
   */
  export type SloganPatternUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SloganPatterns.
     */
    data: XOR<SloganPatternUpdateManyMutationInput, SloganPatternUncheckedUpdateManyInput>
    /**
     * Filter which SloganPatterns to update
     */
    where?: SloganPatternWhereInput
  }

  /**
   * SloganPattern upsert
   */
  export type SloganPatternUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SloganPattern
     */
    select?: SloganPatternSelect<ExtArgs> | null
    /**
     * The filter to search for the SloganPattern to update in case it exists.
     */
    where: SloganPatternWhereUniqueInput
    /**
     * In case the SloganPattern found by the `where` argument doesn't exist, create a new SloganPattern with this data.
     */
    create: XOR<SloganPatternCreateInput, SloganPatternUncheckedCreateInput>
    /**
     * In case the SloganPattern was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SloganPatternUpdateInput, SloganPatternUncheckedUpdateInput>
  }

  /**
   * SloganPattern delete
   */
  export type SloganPatternDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SloganPattern
     */
    select?: SloganPatternSelect<ExtArgs> | null
    /**
     * Filter which SloganPattern to delete.
     */
    where: SloganPatternWhereUniqueInput
  }

  /**
   * SloganPattern deleteMany
   */
  export type SloganPatternDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SloganPatterns to delete
     */
    where?: SloganPatternWhereInput
  }

  /**
   * SloganPattern without action
   */
  export type SloganPatternDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SloganPattern
     */
    select?: SloganPatternSelect<ExtArgs> | null
  }


  /**
   * Model MarketSignal
   */

  export type AggregateMarketSignal = {
    _count: MarketSignalCountAggregateOutputType | null
    _avg: MarketSignalAvgAggregateOutputType | null
    _sum: MarketSignalSumAggregateOutputType | null
    _min: MarketSignalMinAggregateOutputType | null
    _max: MarketSignalMaxAggregateOutputType | null
  }

  export type MarketSignalAvgAggregateOutputType = {
    score: number | null
    confidence: number | null
  }

  export type MarketSignalSumAggregateOutputType = {
    score: number | null
    confidence: number | null
  }

  export type MarketSignalMinAggregateOutputType = {
    id: string | null
    niche: string | null
    text: string | null
    source: string | null
    nicheKey: string | null
    sloganKey: string | null
    tagKey: string | null
    score: number | null
    confidence: number | null
    observedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MarketSignalMaxAggregateOutputType = {
    id: string | null
    niche: string | null
    text: string | null
    source: string | null
    nicheKey: string | null
    sloganKey: string | null
    tagKey: string | null
    score: number | null
    confidence: number | null
    observedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MarketSignalCountAggregateOutputType = {
    id: number
    niche: number
    text: number
    source: number
    nicheKey: number
    sloganKey: number
    tagKey: number
    score: number
    confidence: number
    payload: number
    observedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MarketSignalAvgAggregateInputType = {
    score?: true
    confidence?: true
  }

  export type MarketSignalSumAggregateInputType = {
    score?: true
    confidence?: true
  }

  export type MarketSignalMinAggregateInputType = {
    id?: true
    niche?: true
    text?: true
    source?: true
    nicheKey?: true
    sloganKey?: true
    tagKey?: true
    score?: true
    confidence?: true
    observedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MarketSignalMaxAggregateInputType = {
    id?: true
    niche?: true
    text?: true
    source?: true
    nicheKey?: true
    sloganKey?: true
    tagKey?: true
    score?: true
    confidence?: true
    observedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MarketSignalCountAggregateInputType = {
    id?: true
    niche?: true
    text?: true
    source?: true
    nicheKey?: true
    sloganKey?: true
    tagKey?: true
    score?: true
    confidence?: true
    payload?: true
    observedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MarketSignalAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MarketSignal to aggregate.
     */
    where?: MarketSignalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MarketSignals to fetch.
     */
    orderBy?: MarketSignalOrderByWithRelationInput | MarketSignalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MarketSignalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MarketSignals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MarketSignals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MarketSignals
    **/
    _count?: true | MarketSignalCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MarketSignalAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MarketSignalSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MarketSignalMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MarketSignalMaxAggregateInputType
  }

  export type GetMarketSignalAggregateType<T extends MarketSignalAggregateArgs> = {
        [P in keyof T & keyof AggregateMarketSignal]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMarketSignal[P]>
      : GetScalarType<T[P], AggregateMarketSignal[P]>
  }




  export type MarketSignalGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MarketSignalWhereInput
    orderBy?: MarketSignalOrderByWithAggregationInput | MarketSignalOrderByWithAggregationInput[]
    by: MarketSignalScalarFieldEnum[] | MarketSignalScalarFieldEnum
    having?: MarketSignalScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MarketSignalCountAggregateInputType | true
    _avg?: MarketSignalAvgAggregateInputType
    _sum?: MarketSignalSumAggregateInputType
    _min?: MarketSignalMinAggregateInputType
    _max?: MarketSignalMaxAggregateInputType
  }

  export type MarketSignalGroupByOutputType = {
    id: string
    niche: string
    text: string
    source: string
    nicheKey: string | null
    sloganKey: string | null
    tagKey: string | null
    score: number
    confidence: number
    payload: JsonValue | null
    observedAt: Date
    createdAt: Date
    updatedAt: Date
    _count: MarketSignalCountAggregateOutputType | null
    _avg: MarketSignalAvgAggregateOutputType | null
    _sum: MarketSignalSumAggregateOutputType | null
    _min: MarketSignalMinAggregateOutputType | null
    _max: MarketSignalMaxAggregateOutputType | null
  }

  type GetMarketSignalGroupByPayload<T extends MarketSignalGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MarketSignalGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MarketSignalGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MarketSignalGroupByOutputType[P]>
            : GetScalarType<T[P], MarketSignalGroupByOutputType[P]>
        }
      >
    >


  export type MarketSignalSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    niche?: boolean
    text?: boolean
    source?: boolean
    nicheKey?: boolean
    sloganKey?: boolean
    tagKey?: boolean
    score?: boolean
    confidence?: boolean
    payload?: boolean
    observedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["marketSignal"]>

  export type MarketSignalSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    niche?: boolean
    text?: boolean
    source?: boolean
    nicheKey?: boolean
    sloganKey?: boolean
    tagKey?: boolean
    score?: boolean
    confidence?: boolean
    payload?: boolean
    observedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["marketSignal"]>

  export type MarketSignalSelectScalar = {
    id?: boolean
    niche?: boolean
    text?: boolean
    source?: boolean
    nicheKey?: boolean
    sloganKey?: boolean
    tagKey?: boolean
    score?: boolean
    confidence?: boolean
    payload?: boolean
    observedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $MarketSignalPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MarketSignal"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      niche: string
      text: string
      source: string
      nicheKey: string | null
      sloganKey: string | null
      tagKey: string | null
      score: number
      confidence: number
      payload: Prisma.JsonValue | null
      observedAt: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["marketSignal"]>
    composites: {}
  }

  type MarketSignalGetPayload<S extends boolean | null | undefined | MarketSignalDefaultArgs> = $Result.GetResult<Prisma.$MarketSignalPayload, S>

  type MarketSignalCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<MarketSignalFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: MarketSignalCountAggregateInputType | true
    }

  export interface MarketSignalDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MarketSignal'], meta: { name: 'MarketSignal' } }
    /**
     * Find zero or one MarketSignal that matches the filter.
     * @param {MarketSignalFindUniqueArgs} args - Arguments to find a MarketSignal
     * @example
     * // Get one MarketSignal
     * const marketSignal = await prisma.marketSignal.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MarketSignalFindUniqueArgs>(args: SelectSubset<T, MarketSignalFindUniqueArgs<ExtArgs>>): Prisma__MarketSignalClient<$Result.GetResult<Prisma.$MarketSignalPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one MarketSignal that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {MarketSignalFindUniqueOrThrowArgs} args - Arguments to find a MarketSignal
     * @example
     * // Get one MarketSignal
     * const marketSignal = await prisma.marketSignal.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MarketSignalFindUniqueOrThrowArgs>(args: SelectSubset<T, MarketSignalFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MarketSignalClient<$Result.GetResult<Prisma.$MarketSignalPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first MarketSignal that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketSignalFindFirstArgs} args - Arguments to find a MarketSignal
     * @example
     * // Get one MarketSignal
     * const marketSignal = await prisma.marketSignal.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MarketSignalFindFirstArgs>(args?: SelectSubset<T, MarketSignalFindFirstArgs<ExtArgs>>): Prisma__MarketSignalClient<$Result.GetResult<Prisma.$MarketSignalPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first MarketSignal that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketSignalFindFirstOrThrowArgs} args - Arguments to find a MarketSignal
     * @example
     * // Get one MarketSignal
     * const marketSignal = await prisma.marketSignal.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MarketSignalFindFirstOrThrowArgs>(args?: SelectSubset<T, MarketSignalFindFirstOrThrowArgs<ExtArgs>>): Prisma__MarketSignalClient<$Result.GetResult<Prisma.$MarketSignalPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more MarketSignals that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketSignalFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MarketSignals
     * const marketSignals = await prisma.marketSignal.findMany()
     * 
     * // Get first 10 MarketSignals
     * const marketSignals = await prisma.marketSignal.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const marketSignalWithIdOnly = await prisma.marketSignal.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MarketSignalFindManyArgs>(args?: SelectSubset<T, MarketSignalFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MarketSignalPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a MarketSignal.
     * @param {MarketSignalCreateArgs} args - Arguments to create a MarketSignal.
     * @example
     * // Create one MarketSignal
     * const MarketSignal = await prisma.marketSignal.create({
     *   data: {
     *     // ... data to create a MarketSignal
     *   }
     * })
     * 
     */
    create<T extends MarketSignalCreateArgs>(args: SelectSubset<T, MarketSignalCreateArgs<ExtArgs>>): Prisma__MarketSignalClient<$Result.GetResult<Prisma.$MarketSignalPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many MarketSignals.
     * @param {MarketSignalCreateManyArgs} args - Arguments to create many MarketSignals.
     * @example
     * // Create many MarketSignals
     * const marketSignal = await prisma.marketSignal.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MarketSignalCreateManyArgs>(args?: SelectSubset<T, MarketSignalCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MarketSignals and returns the data saved in the database.
     * @param {MarketSignalCreateManyAndReturnArgs} args - Arguments to create many MarketSignals.
     * @example
     * // Create many MarketSignals
     * const marketSignal = await prisma.marketSignal.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MarketSignals and only return the `id`
     * const marketSignalWithIdOnly = await prisma.marketSignal.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MarketSignalCreateManyAndReturnArgs>(args?: SelectSubset<T, MarketSignalCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MarketSignalPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a MarketSignal.
     * @param {MarketSignalDeleteArgs} args - Arguments to delete one MarketSignal.
     * @example
     * // Delete one MarketSignal
     * const MarketSignal = await prisma.marketSignal.delete({
     *   where: {
     *     // ... filter to delete one MarketSignal
     *   }
     * })
     * 
     */
    delete<T extends MarketSignalDeleteArgs>(args: SelectSubset<T, MarketSignalDeleteArgs<ExtArgs>>): Prisma__MarketSignalClient<$Result.GetResult<Prisma.$MarketSignalPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one MarketSignal.
     * @param {MarketSignalUpdateArgs} args - Arguments to update one MarketSignal.
     * @example
     * // Update one MarketSignal
     * const marketSignal = await prisma.marketSignal.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MarketSignalUpdateArgs>(args: SelectSubset<T, MarketSignalUpdateArgs<ExtArgs>>): Prisma__MarketSignalClient<$Result.GetResult<Prisma.$MarketSignalPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more MarketSignals.
     * @param {MarketSignalDeleteManyArgs} args - Arguments to filter MarketSignals to delete.
     * @example
     * // Delete a few MarketSignals
     * const { count } = await prisma.marketSignal.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MarketSignalDeleteManyArgs>(args?: SelectSubset<T, MarketSignalDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MarketSignals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketSignalUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MarketSignals
     * const marketSignal = await prisma.marketSignal.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MarketSignalUpdateManyArgs>(args: SelectSubset<T, MarketSignalUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one MarketSignal.
     * @param {MarketSignalUpsertArgs} args - Arguments to update or create a MarketSignal.
     * @example
     * // Update or create a MarketSignal
     * const marketSignal = await prisma.marketSignal.upsert({
     *   create: {
     *     // ... data to create a MarketSignal
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MarketSignal we want to update
     *   }
     * })
     */
    upsert<T extends MarketSignalUpsertArgs>(args: SelectSubset<T, MarketSignalUpsertArgs<ExtArgs>>): Prisma__MarketSignalClient<$Result.GetResult<Prisma.$MarketSignalPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of MarketSignals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketSignalCountArgs} args - Arguments to filter MarketSignals to count.
     * @example
     * // Count the number of MarketSignals
     * const count = await prisma.marketSignal.count({
     *   where: {
     *     // ... the filter for the MarketSignals we want to count
     *   }
     * })
    **/
    count<T extends MarketSignalCountArgs>(
      args?: Subset<T, MarketSignalCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MarketSignalCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MarketSignal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketSignalAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MarketSignalAggregateArgs>(args: Subset<T, MarketSignalAggregateArgs>): Prisma.PrismaPromise<GetMarketSignalAggregateType<T>>

    /**
     * Group by MarketSignal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketSignalGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MarketSignalGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MarketSignalGroupByArgs['orderBy'] }
        : { orderBy?: MarketSignalGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MarketSignalGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMarketSignalGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MarketSignal model
   */
  readonly fields: MarketSignalFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MarketSignal.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MarketSignalClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MarketSignal model
   */ 
  interface MarketSignalFieldRefs {
    readonly id: FieldRef<"MarketSignal", 'String'>
    readonly niche: FieldRef<"MarketSignal", 'String'>
    readonly text: FieldRef<"MarketSignal", 'String'>
    readonly source: FieldRef<"MarketSignal", 'String'>
    readonly nicheKey: FieldRef<"MarketSignal", 'String'>
    readonly sloganKey: FieldRef<"MarketSignal", 'String'>
    readonly tagKey: FieldRef<"MarketSignal", 'String'>
    readonly score: FieldRef<"MarketSignal", 'Float'>
    readonly confidence: FieldRef<"MarketSignal", 'Float'>
    readonly payload: FieldRef<"MarketSignal", 'Json'>
    readonly observedAt: FieldRef<"MarketSignal", 'DateTime'>
    readonly createdAt: FieldRef<"MarketSignal", 'DateTime'>
    readonly updatedAt: FieldRef<"MarketSignal", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MarketSignal findUnique
   */
  export type MarketSignalFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketSignal
     */
    select?: MarketSignalSelect<ExtArgs> | null
    /**
     * Filter, which MarketSignal to fetch.
     */
    where: MarketSignalWhereUniqueInput
  }

  /**
   * MarketSignal findUniqueOrThrow
   */
  export type MarketSignalFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketSignal
     */
    select?: MarketSignalSelect<ExtArgs> | null
    /**
     * Filter, which MarketSignal to fetch.
     */
    where: MarketSignalWhereUniqueInput
  }

  /**
   * MarketSignal findFirst
   */
  export type MarketSignalFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketSignal
     */
    select?: MarketSignalSelect<ExtArgs> | null
    /**
     * Filter, which MarketSignal to fetch.
     */
    where?: MarketSignalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MarketSignals to fetch.
     */
    orderBy?: MarketSignalOrderByWithRelationInput | MarketSignalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MarketSignals.
     */
    cursor?: MarketSignalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MarketSignals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MarketSignals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MarketSignals.
     */
    distinct?: MarketSignalScalarFieldEnum | MarketSignalScalarFieldEnum[]
  }

  /**
   * MarketSignal findFirstOrThrow
   */
  export type MarketSignalFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketSignal
     */
    select?: MarketSignalSelect<ExtArgs> | null
    /**
     * Filter, which MarketSignal to fetch.
     */
    where?: MarketSignalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MarketSignals to fetch.
     */
    orderBy?: MarketSignalOrderByWithRelationInput | MarketSignalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MarketSignals.
     */
    cursor?: MarketSignalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MarketSignals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MarketSignals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MarketSignals.
     */
    distinct?: MarketSignalScalarFieldEnum | MarketSignalScalarFieldEnum[]
  }

  /**
   * MarketSignal findMany
   */
  export type MarketSignalFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketSignal
     */
    select?: MarketSignalSelect<ExtArgs> | null
    /**
     * Filter, which MarketSignals to fetch.
     */
    where?: MarketSignalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MarketSignals to fetch.
     */
    orderBy?: MarketSignalOrderByWithRelationInput | MarketSignalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MarketSignals.
     */
    cursor?: MarketSignalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MarketSignals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MarketSignals.
     */
    skip?: number
    distinct?: MarketSignalScalarFieldEnum | MarketSignalScalarFieldEnum[]
  }

  /**
   * MarketSignal create
   */
  export type MarketSignalCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketSignal
     */
    select?: MarketSignalSelect<ExtArgs> | null
    /**
     * The data needed to create a MarketSignal.
     */
    data: XOR<MarketSignalCreateInput, MarketSignalUncheckedCreateInput>
  }

  /**
   * MarketSignal createMany
   */
  export type MarketSignalCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MarketSignals.
     */
    data: MarketSignalCreateManyInput | MarketSignalCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MarketSignal createManyAndReturn
   */
  export type MarketSignalCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketSignal
     */
    select?: MarketSignalSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many MarketSignals.
     */
    data: MarketSignalCreateManyInput | MarketSignalCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MarketSignal update
   */
  export type MarketSignalUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketSignal
     */
    select?: MarketSignalSelect<ExtArgs> | null
    /**
     * The data needed to update a MarketSignal.
     */
    data: XOR<MarketSignalUpdateInput, MarketSignalUncheckedUpdateInput>
    /**
     * Choose, which MarketSignal to update.
     */
    where: MarketSignalWhereUniqueInput
  }

  /**
   * MarketSignal updateMany
   */
  export type MarketSignalUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MarketSignals.
     */
    data: XOR<MarketSignalUpdateManyMutationInput, MarketSignalUncheckedUpdateManyInput>
    /**
     * Filter which MarketSignals to update
     */
    where?: MarketSignalWhereInput
  }

  /**
   * MarketSignal upsert
   */
  export type MarketSignalUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketSignal
     */
    select?: MarketSignalSelect<ExtArgs> | null
    /**
     * The filter to search for the MarketSignal to update in case it exists.
     */
    where: MarketSignalWhereUniqueInput
    /**
     * In case the MarketSignal found by the `where` argument doesn't exist, create a new MarketSignal with this data.
     */
    create: XOR<MarketSignalCreateInput, MarketSignalUncheckedCreateInput>
    /**
     * In case the MarketSignal was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MarketSignalUpdateInput, MarketSignalUncheckedUpdateInput>
  }

  /**
   * MarketSignal delete
   */
  export type MarketSignalDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketSignal
     */
    select?: MarketSignalSelect<ExtArgs> | null
    /**
     * Filter which MarketSignal to delete.
     */
    where: MarketSignalWhereUniqueInput
  }

  /**
   * MarketSignal deleteMany
   */
  export type MarketSignalDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MarketSignals to delete
     */
    where?: MarketSignalWhereInput
  }

  /**
   * MarketSignal without action
   */
  export type MarketSignalDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketSignal
     */
    select?: MarketSignalSelect<ExtArgs> | null
  }


  /**
   * Model ListingQueue
   */

  export type AggregateListingQueue = {
    _count: ListingQueueCountAggregateOutputType | null
    _avg: ListingQueueAvgAggregateOutputType | null
    _sum: ListingQueueSumAggregateOutputType | null
    _min: ListingQueueMinAggregateOutputType | null
    _max: ListingQueueMaxAggregateOutputType | null
  }

  export type ListingQueueAvgAggregateOutputType = {
    priorityScore: number | null
  }

  export type ListingQueueSumAggregateOutputType = {
    priorityScore: number | null
  }

  export type ListingQueueMinAggregateOutputType = {
    id: string | null
    niche: string | null
    slogan: string | null
    title: string | null
    mockupPrompt: string | null
    status: string | null
    platform: string | null
    priorityScore: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ListingQueueMaxAggregateOutputType = {
    id: string | null
    niche: string | null
    slogan: string | null
    title: string | null
    mockupPrompt: string | null
    status: string | null
    platform: string | null
    priorityScore: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ListingQueueCountAggregateOutputType = {
    id: number
    niche: number
    slogan: number
    title: number
    bullets: number
    tags: number
    mockupPrompt: number
    adHooks: number
    visualBatchMetrics: number
    visualStrategyMetrics: number
    visualReleaseGate: number
    status: number
    platform: number
    priorityScore: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ListingQueueAvgAggregateInputType = {
    priorityScore?: true
  }

  export type ListingQueueSumAggregateInputType = {
    priorityScore?: true
  }

  export type ListingQueueMinAggregateInputType = {
    id?: true
    niche?: true
    slogan?: true
    title?: true
    mockupPrompt?: true
    status?: true
    platform?: true
    priorityScore?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ListingQueueMaxAggregateInputType = {
    id?: true
    niche?: true
    slogan?: true
    title?: true
    mockupPrompt?: true
    status?: true
    platform?: true
    priorityScore?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ListingQueueCountAggregateInputType = {
    id?: true
    niche?: true
    slogan?: true
    title?: true
    bullets?: true
    tags?: true
    mockupPrompt?: true
    adHooks?: true
    visualBatchMetrics?: true
    visualStrategyMetrics?: true
    visualReleaseGate?: true
    status?: true
    platform?: true
    priorityScore?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ListingQueueAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ListingQueue to aggregate.
     */
    where?: ListingQueueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ListingQueues to fetch.
     */
    orderBy?: ListingQueueOrderByWithRelationInput | ListingQueueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ListingQueueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ListingQueues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ListingQueues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ListingQueues
    **/
    _count?: true | ListingQueueCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ListingQueueAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ListingQueueSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ListingQueueMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ListingQueueMaxAggregateInputType
  }

  export type GetListingQueueAggregateType<T extends ListingQueueAggregateArgs> = {
        [P in keyof T & keyof AggregateListingQueue]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateListingQueue[P]>
      : GetScalarType<T[P], AggregateListingQueue[P]>
  }




  export type ListingQueueGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ListingQueueWhereInput
    orderBy?: ListingQueueOrderByWithAggregationInput | ListingQueueOrderByWithAggregationInput[]
    by: ListingQueueScalarFieldEnum[] | ListingQueueScalarFieldEnum
    having?: ListingQueueScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ListingQueueCountAggregateInputType | true
    _avg?: ListingQueueAvgAggregateInputType
    _sum?: ListingQueueSumAggregateInputType
    _min?: ListingQueueMinAggregateInputType
    _max?: ListingQueueMaxAggregateInputType
  }

  export type ListingQueueGroupByOutputType = {
    id: string
    niche: string
    slogan: string
    title: string
    bullets: string[]
    tags: string[]
    mockupPrompt: string
    adHooks: string[]
    visualBatchMetrics: JsonValue | null
    visualStrategyMetrics: JsonValue | null
    visualReleaseGate: JsonValue | null
    status: string
    platform: string
    priorityScore: number | null
    createdAt: Date
    updatedAt: Date
    _count: ListingQueueCountAggregateOutputType | null
    _avg: ListingQueueAvgAggregateOutputType | null
    _sum: ListingQueueSumAggregateOutputType | null
    _min: ListingQueueMinAggregateOutputType | null
    _max: ListingQueueMaxAggregateOutputType | null
  }

  type GetListingQueueGroupByPayload<T extends ListingQueueGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ListingQueueGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ListingQueueGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ListingQueueGroupByOutputType[P]>
            : GetScalarType<T[P], ListingQueueGroupByOutputType[P]>
        }
      >
    >


  export type ListingQueueSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    niche?: boolean
    slogan?: boolean
    title?: boolean
    bullets?: boolean
    tags?: boolean
    mockupPrompt?: boolean
    adHooks?: boolean
    visualBatchMetrics?: boolean
    visualStrategyMetrics?: boolean
    visualReleaseGate?: boolean
    status?: boolean
    platform?: boolean
    priorityScore?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["listingQueue"]>

  export type ListingQueueSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    niche?: boolean
    slogan?: boolean
    title?: boolean
    bullets?: boolean
    tags?: boolean
    mockupPrompt?: boolean
    adHooks?: boolean
    visualBatchMetrics?: boolean
    visualStrategyMetrics?: boolean
    visualReleaseGate?: boolean
    status?: boolean
    platform?: boolean
    priorityScore?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["listingQueue"]>

  export type ListingQueueSelectScalar = {
    id?: boolean
    niche?: boolean
    slogan?: boolean
    title?: boolean
    bullets?: boolean
    tags?: boolean
    mockupPrompt?: boolean
    adHooks?: boolean
    visualBatchMetrics?: boolean
    visualStrategyMetrics?: boolean
    visualReleaseGate?: boolean
    status?: boolean
    platform?: boolean
    priorityScore?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $ListingQueuePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ListingQueue"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      niche: string
      slogan: string
      title: string
      bullets: string[]
      tags: string[]
      mockupPrompt: string
      adHooks: string[]
      visualBatchMetrics: Prisma.JsonValue | null
      visualStrategyMetrics: Prisma.JsonValue | null
      visualReleaseGate: Prisma.JsonValue | null
      status: string
      platform: string
      priorityScore: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["listingQueue"]>
    composites: {}
  }

  type ListingQueueGetPayload<S extends boolean | null | undefined | ListingQueueDefaultArgs> = $Result.GetResult<Prisma.$ListingQueuePayload, S>

  type ListingQueueCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ListingQueueFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ListingQueueCountAggregateInputType | true
    }

  export interface ListingQueueDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ListingQueue'], meta: { name: 'ListingQueue' } }
    /**
     * Find zero or one ListingQueue that matches the filter.
     * @param {ListingQueueFindUniqueArgs} args - Arguments to find a ListingQueue
     * @example
     * // Get one ListingQueue
     * const listingQueue = await prisma.listingQueue.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ListingQueueFindUniqueArgs>(args: SelectSubset<T, ListingQueueFindUniqueArgs<ExtArgs>>): Prisma__ListingQueueClient<$Result.GetResult<Prisma.$ListingQueuePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ListingQueue that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ListingQueueFindUniqueOrThrowArgs} args - Arguments to find a ListingQueue
     * @example
     * // Get one ListingQueue
     * const listingQueue = await prisma.listingQueue.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ListingQueueFindUniqueOrThrowArgs>(args: SelectSubset<T, ListingQueueFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ListingQueueClient<$Result.GetResult<Prisma.$ListingQueuePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ListingQueue that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingQueueFindFirstArgs} args - Arguments to find a ListingQueue
     * @example
     * // Get one ListingQueue
     * const listingQueue = await prisma.listingQueue.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ListingQueueFindFirstArgs>(args?: SelectSubset<T, ListingQueueFindFirstArgs<ExtArgs>>): Prisma__ListingQueueClient<$Result.GetResult<Prisma.$ListingQueuePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ListingQueue that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingQueueFindFirstOrThrowArgs} args - Arguments to find a ListingQueue
     * @example
     * // Get one ListingQueue
     * const listingQueue = await prisma.listingQueue.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ListingQueueFindFirstOrThrowArgs>(args?: SelectSubset<T, ListingQueueFindFirstOrThrowArgs<ExtArgs>>): Prisma__ListingQueueClient<$Result.GetResult<Prisma.$ListingQueuePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ListingQueues that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingQueueFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ListingQueues
     * const listingQueues = await prisma.listingQueue.findMany()
     * 
     * // Get first 10 ListingQueues
     * const listingQueues = await prisma.listingQueue.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const listingQueueWithIdOnly = await prisma.listingQueue.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ListingQueueFindManyArgs>(args?: SelectSubset<T, ListingQueueFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ListingQueuePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ListingQueue.
     * @param {ListingQueueCreateArgs} args - Arguments to create a ListingQueue.
     * @example
     * // Create one ListingQueue
     * const ListingQueue = await prisma.listingQueue.create({
     *   data: {
     *     // ... data to create a ListingQueue
     *   }
     * })
     * 
     */
    create<T extends ListingQueueCreateArgs>(args: SelectSubset<T, ListingQueueCreateArgs<ExtArgs>>): Prisma__ListingQueueClient<$Result.GetResult<Prisma.$ListingQueuePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ListingQueues.
     * @param {ListingQueueCreateManyArgs} args - Arguments to create many ListingQueues.
     * @example
     * // Create many ListingQueues
     * const listingQueue = await prisma.listingQueue.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ListingQueueCreateManyArgs>(args?: SelectSubset<T, ListingQueueCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ListingQueues and returns the data saved in the database.
     * @param {ListingQueueCreateManyAndReturnArgs} args - Arguments to create many ListingQueues.
     * @example
     * // Create many ListingQueues
     * const listingQueue = await prisma.listingQueue.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ListingQueues and only return the `id`
     * const listingQueueWithIdOnly = await prisma.listingQueue.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ListingQueueCreateManyAndReturnArgs>(args?: SelectSubset<T, ListingQueueCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ListingQueuePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ListingQueue.
     * @param {ListingQueueDeleteArgs} args - Arguments to delete one ListingQueue.
     * @example
     * // Delete one ListingQueue
     * const ListingQueue = await prisma.listingQueue.delete({
     *   where: {
     *     // ... filter to delete one ListingQueue
     *   }
     * })
     * 
     */
    delete<T extends ListingQueueDeleteArgs>(args: SelectSubset<T, ListingQueueDeleteArgs<ExtArgs>>): Prisma__ListingQueueClient<$Result.GetResult<Prisma.$ListingQueuePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ListingQueue.
     * @param {ListingQueueUpdateArgs} args - Arguments to update one ListingQueue.
     * @example
     * // Update one ListingQueue
     * const listingQueue = await prisma.listingQueue.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ListingQueueUpdateArgs>(args: SelectSubset<T, ListingQueueUpdateArgs<ExtArgs>>): Prisma__ListingQueueClient<$Result.GetResult<Prisma.$ListingQueuePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ListingQueues.
     * @param {ListingQueueDeleteManyArgs} args - Arguments to filter ListingQueues to delete.
     * @example
     * // Delete a few ListingQueues
     * const { count } = await prisma.listingQueue.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ListingQueueDeleteManyArgs>(args?: SelectSubset<T, ListingQueueDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ListingQueues.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingQueueUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ListingQueues
     * const listingQueue = await prisma.listingQueue.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ListingQueueUpdateManyArgs>(args: SelectSubset<T, ListingQueueUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ListingQueue.
     * @param {ListingQueueUpsertArgs} args - Arguments to update or create a ListingQueue.
     * @example
     * // Update or create a ListingQueue
     * const listingQueue = await prisma.listingQueue.upsert({
     *   create: {
     *     // ... data to create a ListingQueue
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ListingQueue we want to update
     *   }
     * })
     */
    upsert<T extends ListingQueueUpsertArgs>(args: SelectSubset<T, ListingQueueUpsertArgs<ExtArgs>>): Prisma__ListingQueueClient<$Result.GetResult<Prisma.$ListingQueuePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ListingQueues.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingQueueCountArgs} args - Arguments to filter ListingQueues to count.
     * @example
     * // Count the number of ListingQueues
     * const count = await prisma.listingQueue.count({
     *   where: {
     *     // ... the filter for the ListingQueues we want to count
     *   }
     * })
    **/
    count<T extends ListingQueueCountArgs>(
      args?: Subset<T, ListingQueueCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ListingQueueCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ListingQueue.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingQueueAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ListingQueueAggregateArgs>(args: Subset<T, ListingQueueAggregateArgs>): Prisma.PrismaPromise<GetListingQueueAggregateType<T>>

    /**
     * Group by ListingQueue.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingQueueGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ListingQueueGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ListingQueueGroupByArgs['orderBy'] }
        : { orderBy?: ListingQueueGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ListingQueueGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetListingQueueGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ListingQueue model
   */
  readonly fields: ListingQueueFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ListingQueue.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ListingQueueClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ListingQueue model
   */ 
  interface ListingQueueFieldRefs {
    readonly id: FieldRef<"ListingQueue", 'String'>
    readonly niche: FieldRef<"ListingQueue", 'String'>
    readonly slogan: FieldRef<"ListingQueue", 'String'>
    readonly title: FieldRef<"ListingQueue", 'String'>
    readonly bullets: FieldRef<"ListingQueue", 'String[]'>
    readonly tags: FieldRef<"ListingQueue", 'String[]'>
    readonly mockupPrompt: FieldRef<"ListingQueue", 'String'>
    readonly adHooks: FieldRef<"ListingQueue", 'String[]'>
    readonly visualBatchMetrics: FieldRef<"ListingQueue", 'Json'>
    readonly visualStrategyMetrics: FieldRef<"ListingQueue", 'Json'>
    readonly visualReleaseGate: FieldRef<"ListingQueue", 'Json'>
    readonly status: FieldRef<"ListingQueue", 'String'>
    readonly platform: FieldRef<"ListingQueue", 'String'>
    readonly priorityScore: FieldRef<"ListingQueue", 'Float'>
    readonly createdAt: FieldRef<"ListingQueue", 'DateTime'>
    readonly updatedAt: FieldRef<"ListingQueue", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ListingQueue findUnique
   */
  export type ListingQueueFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ListingQueue
     */
    select?: ListingQueueSelect<ExtArgs> | null
    /**
     * Filter, which ListingQueue to fetch.
     */
    where: ListingQueueWhereUniqueInput
  }

  /**
   * ListingQueue findUniqueOrThrow
   */
  export type ListingQueueFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ListingQueue
     */
    select?: ListingQueueSelect<ExtArgs> | null
    /**
     * Filter, which ListingQueue to fetch.
     */
    where: ListingQueueWhereUniqueInput
  }

  /**
   * ListingQueue findFirst
   */
  export type ListingQueueFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ListingQueue
     */
    select?: ListingQueueSelect<ExtArgs> | null
    /**
     * Filter, which ListingQueue to fetch.
     */
    where?: ListingQueueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ListingQueues to fetch.
     */
    orderBy?: ListingQueueOrderByWithRelationInput | ListingQueueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ListingQueues.
     */
    cursor?: ListingQueueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ListingQueues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ListingQueues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ListingQueues.
     */
    distinct?: ListingQueueScalarFieldEnum | ListingQueueScalarFieldEnum[]
  }

  /**
   * ListingQueue findFirstOrThrow
   */
  export type ListingQueueFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ListingQueue
     */
    select?: ListingQueueSelect<ExtArgs> | null
    /**
     * Filter, which ListingQueue to fetch.
     */
    where?: ListingQueueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ListingQueues to fetch.
     */
    orderBy?: ListingQueueOrderByWithRelationInput | ListingQueueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ListingQueues.
     */
    cursor?: ListingQueueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ListingQueues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ListingQueues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ListingQueues.
     */
    distinct?: ListingQueueScalarFieldEnum | ListingQueueScalarFieldEnum[]
  }

  /**
   * ListingQueue findMany
   */
  export type ListingQueueFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ListingQueue
     */
    select?: ListingQueueSelect<ExtArgs> | null
    /**
     * Filter, which ListingQueues to fetch.
     */
    where?: ListingQueueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ListingQueues to fetch.
     */
    orderBy?: ListingQueueOrderByWithRelationInput | ListingQueueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ListingQueues.
     */
    cursor?: ListingQueueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ListingQueues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ListingQueues.
     */
    skip?: number
    distinct?: ListingQueueScalarFieldEnum | ListingQueueScalarFieldEnum[]
  }

  /**
   * ListingQueue create
   */
  export type ListingQueueCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ListingQueue
     */
    select?: ListingQueueSelect<ExtArgs> | null
    /**
     * The data needed to create a ListingQueue.
     */
    data: XOR<ListingQueueCreateInput, ListingQueueUncheckedCreateInput>
  }

  /**
   * ListingQueue createMany
   */
  export type ListingQueueCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ListingQueues.
     */
    data: ListingQueueCreateManyInput | ListingQueueCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ListingQueue createManyAndReturn
   */
  export type ListingQueueCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ListingQueue
     */
    select?: ListingQueueSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ListingQueues.
     */
    data: ListingQueueCreateManyInput | ListingQueueCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ListingQueue update
   */
  export type ListingQueueUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ListingQueue
     */
    select?: ListingQueueSelect<ExtArgs> | null
    /**
     * The data needed to update a ListingQueue.
     */
    data: XOR<ListingQueueUpdateInput, ListingQueueUncheckedUpdateInput>
    /**
     * Choose, which ListingQueue to update.
     */
    where: ListingQueueWhereUniqueInput
  }

  /**
   * ListingQueue updateMany
   */
  export type ListingQueueUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ListingQueues.
     */
    data: XOR<ListingQueueUpdateManyMutationInput, ListingQueueUncheckedUpdateManyInput>
    /**
     * Filter which ListingQueues to update
     */
    where?: ListingQueueWhereInput
  }

  /**
   * ListingQueue upsert
   */
  export type ListingQueueUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ListingQueue
     */
    select?: ListingQueueSelect<ExtArgs> | null
    /**
     * The filter to search for the ListingQueue to update in case it exists.
     */
    where: ListingQueueWhereUniqueInput
    /**
     * In case the ListingQueue found by the `where` argument doesn't exist, create a new ListingQueue with this data.
     */
    create: XOR<ListingQueueCreateInput, ListingQueueUncheckedCreateInput>
    /**
     * In case the ListingQueue was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ListingQueueUpdateInput, ListingQueueUncheckedUpdateInput>
  }

  /**
   * ListingQueue delete
   */
  export type ListingQueueDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ListingQueue
     */
    select?: ListingQueueSelect<ExtArgs> | null
    /**
     * Filter which ListingQueue to delete.
     */
    where: ListingQueueWhereUniqueInput
  }

  /**
   * ListingQueue deleteMany
   */
  export type ListingQueueDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ListingQueues to delete
     */
    where?: ListingQueueWhereInput
  }

  /**
   * ListingQueue without action
   */
  export type ListingQueueDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ListingQueue
     */
    select?: ListingQueueSelect<ExtArgs> | null
  }


  /**
   * Model ListingPerformance
   */

  export type AggregateListingPerformance = {
    _count: ListingPerformanceCountAggregateOutputType | null
    _avg: ListingPerformanceAvgAggregateOutputType | null
    _sum: ListingPerformanceSumAggregateOutputType | null
    _min: ListingPerformanceMinAggregateOutputType | null
    _max: ListingPerformanceMaxAggregateOutputType | null
  }

  export type ListingPerformanceAvgAggregateOutputType = {
    impressions: number | null
    clicks: number | null
    ctr: number | null
    conversions: number | null
    revenue: number | null
  }

  export type ListingPerformanceSumAggregateOutputType = {
    impressions: number | null
    clicks: number | null
    ctr: number | null
    conversions: number | null
    revenue: number | null
  }

  export type ListingPerformanceMinAggregateOutputType = {
    id: string | null
    listingId: string | null
    impressions: number | null
    clicks: number | null
    ctr: number | null
    conversions: number | null
    revenue: number | null
    observedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ListingPerformanceMaxAggregateOutputType = {
    id: string | null
    listingId: string | null
    impressions: number | null
    clicks: number | null
    ctr: number | null
    conversions: number | null
    revenue: number | null
    observedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ListingPerformanceCountAggregateOutputType = {
    id: number
    listingId: number
    impressions: number
    clicks: number
    ctr: number
    conversions: number
    revenue: number
    visualBatchMetrics: number
    visualStrategyMetrics: number
    visualReleaseGate: number
    observedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ListingPerformanceAvgAggregateInputType = {
    impressions?: true
    clicks?: true
    ctr?: true
    conversions?: true
    revenue?: true
  }

  export type ListingPerformanceSumAggregateInputType = {
    impressions?: true
    clicks?: true
    ctr?: true
    conversions?: true
    revenue?: true
  }

  export type ListingPerformanceMinAggregateInputType = {
    id?: true
    listingId?: true
    impressions?: true
    clicks?: true
    ctr?: true
    conversions?: true
    revenue?: true
    observedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ListingPerformanceMaxAggregateInputType = {
    id?: true
    listingId?: true
    impressions?: true
    clicks?: true
    ctr?: true
    conversions?: true
    revenue?: true
    observedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ListingPerformanceCountAggregateInputType = {
    id?: true
    listingId?: true
    impressions?: true
    clicks?: true
    ctr?: true
    conversions?: true
    revenue?: true
    visualBatchMetrics?: true
    visualStrategyMetrics?: true
    visualReleaseGate?: true
    observedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ListingPerformanceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ListingPerformance to aggregate.
     */
    where?: ListingPerformanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ListingPerformances to fetch.
     */
    orderBy?: ListingPerformanceOrderByWithRelationInput | ListingPerformanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ListingPerformanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ListingPerformances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ListingPerformances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ListingPerformances
    **/
    _count?: true | ListingPerformanceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ListingPerformanceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ListingPerformanceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ListingPerformanceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ListingPerformanceMaxAggregateInputType
  }

  export type GetListingPerformanceAggregateType<T extends ListingPerformanceAggregateArgs> = {
        [P in keyof T & keyof AggregateListingPerformance]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateListingPerformance[P]>
      : GetScalarType<T[P], AggregateListingPerformance[P]>
  }




  export type ListingPerformanceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ListingPerformanceWhereInput
    orderBy?: ListingPerformanceOrderByWithAggregationInput | ListingPerformanceOrderByWithAggregationInput[]
    by: ListingPerformanceScalarFieldEnum[] | ListingPerformanceScalarFieldEnum
    having?: ListingPerformanceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ListingPerformanceCountAggregateInputType | true
    _avg?: ListingPerformanceAvgAggregateInputType
    _sum?: ListingPerformanceSumAggregateInputType
    _min?: ListingPerformanceMinAggregateInputType
    _max?: ListingPerformanceMaxAggregateInputType
  }

  export type ListingPerformanceGroupByOutputType = {
    id: string
    listingId: string
    impressions: number
    clicks: number
    ctr: number
    conversions: number
    revenue: number
    visualBatchMetrics: JsonValue | null
    visualStrategyMetrics: JsonValue | null
    visualReleaseGate: JsonValue | null
    observedAt: Date
    createdAt: Date
    updatedAt: Date
    _count: ListingPerformanceCountAggregateOutputType | null
    _avg: ListingPerformanceAvgAggregateOutputType | null
    _sum: ListingPerformanceSumAggregateOutputType | null
    _min: ListingPerformanceMinAggregateOutputType | null
    _max: ListingPerformanceMaxAggregateOutputType | null
  }

  type GetListingPerformanceGroupByPayload<T extends ListingPerformanceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ListingPerformanceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ListingPerformanceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ListingPerformanceGroupByOutputType[P]>
            : GetScalarType<T[P], ListingPerformanceGroupByOutputType[P]>
        }
      >
    >


  export type ListingPerformanceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    listingId?: boolean
    impressions?: boolean
    clicks?: boolean
    ctr?: boolean
    conversions?: boolean
    revenue?: boolean
    visualBatchMetrics?: boolean
    visualStrategyMetrics?: boolean
    visualReleaseGate?: boolean
    observedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["listingPerformance"]>

  export type ListingPerformanceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    listingId?: boolean
    impressions?: boolean
    clicks?: boolean
    ctr?: boolean
    conversions?: boolean
    revenue?: boolean
    visualBatchMetrics?: boolean
    visualStrategyMetrics?: boolean
    visualReleaseGate?: boolean
    observedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["listingPerformance"]>

  export type ListingPerformanceSelectScalar = {
    id?: boolean
    listingId?: boolean
    impressions?: boolean
    clicks?: boolean
    ctr?: boolean
    conversions?: boolean
    revenue?: boolean
    visualBatchMetrics?: boolean
    visualStrategyMetrics?: boolean
    visualReleaseGate?: boolean
    observedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $ListingPerformancePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ListingPerformance"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      listingId: string
      impressions: number
      clicks: number
      ctr: number
      conversions: number
      revenue: number
      visualBatchMetrics: Prisma.JsonValue | null
      visualStrategyMetrics: Prisma.JsonValue | null
      visualReleaseGate: Prisma.JsonValue | null
      observedAt: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["listingPerformance"]>
    composites: {}
  }

  type ListingPerformanceGetPayload<S extends boolean | null | undefined | ListingPerformanceDefaultArgs> = $Result.GetResult<Prisma.$ListingPerformancePayload, S>

  type ListingPerformanceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ListingPerformanceFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ListingPerformanceCountAggregateInputType | true
    }

  export interface ListingPerformanceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ListingPerformance'], meta: { name: 'ListingPerformance' } }
    /**
     * Find zero or one ListingPerformance that matches the filter.
     * @param {ListingPerformanceFindUniqueArgs} args - Arguments to find a ListingPerformance
     * @example
     * // Get one ListingPerformance
     * const listingPerformance = await prisma.listingPerformance.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ListingPerformanceFindUniqueArgs>(args: SelectSubset<T, ListingPerformanceFindUniqueArgs<ExtArgs>>): Prisma__ListingPerformanceClient<$Result.GetResult<Prisma.$ListingPerformancePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ListingPerformance that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ListingPerformanceFindUniqueOrThrowArgs} args - Arguments to find a ListingPerformance
     * @example
     * // Get one ListingPerformance
     * const listingPerformance = await prisma.listingPerformance.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ListingPerformanceFindUniqueOrThrowArgs>(args: SelectSubset<T, ListingPerformanceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ListingPerformanceClient<$Result.GetResult<Prisma.$ListingPerformancePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ListingPerformance that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingPerformanceFindFirstArgs} args - Arguments to find a ListingPerformance
     * @example
     * // Get one ListingPerformance
     * const listingPerformance = await prisma.listingPerformance.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ListingPerformanceFindFirstArgs>(args?: SelectSubset<T, ListingPerformanceFindFirstArgs<ExtArgs>>): Prisma__ListingPerformanceClient<$Result.GetResult<Prisma.$ListingPerformancePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ListingPerformance that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingPerformanceFindFirstOrThrowArgs} args - Arguments to find a ListingPerformance
     * @example
     * // Get one ListingPerformance
     * const listingPerformance = await prisma.listingPerformance.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ListingPerformanceFindFirstOrThrowArgs>(args?: SelectSubset<T, ListingPerformanceFindFirstOrThrowArgs<ExtArgs>>): Prisma__ListingPerformanceClient<$Result.GetResult<Prisma.$ListingPerformancePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ListingPerformances that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingPerformanceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ListingPerformances
     * const listingPerformances = await prisma.listingPerformance.findMany()
     * 
     * // Get first 10 ListingPerformances
     * const listingPerformances = await prisma.listingPerformance.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const listingPerformanceWithIdOnly = await prisma.listingPerformance.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ListingPerformanceFindManyArgs>(args?: SelectSubset<T, ListingPerformanceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ListingPerformancePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ListingPerformance.
     * @param {ListingPerformanceCreateArgs} args - Arguments to create a ListingPerformance.
     * @example
     * // Create one ListingPerformance
     * const ListingPerformance = await prisma.listingPerformance.create({
     *   data: {
     *     // ... data to create a ListingPerformance
     *   }
     * })
     * 
     */
    create<T extends ListingPerformanceCreateArgs>(args: SelectSubset<T, ListingPerformanceCreateArgs<ExtArgs>>): Prisma__ListingPerformanceClient<$Result.GetResult<Prisma.$ListingPerformancePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ListingPerformances.
     * @param {ListingPerformanceCreateManyArgs} args - Arguments to create many ListingPerformances.
     * @example
     * // Create many ListingPerformances
     * const listingPerformance = await prisma.listingPerformance.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ListingPerformanceCreateManyArgs>(args?: SelectSubset<T, ListingPerformanceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ListingPerformances and returns the data saved in the database.
     * @param {ListingPerformanceCreateManyAndReturnArgs} args - Arguments to create many ListingPerformances.
     * @example
     * // Create many ListingPerformances
     * const listingPerformance = await prisma.listingPerformance.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ListingPerformances and only return the `id`
     * const listingPerformanceWithIdOnly = await prisma.listingPerformance.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ListingPerformanceCreateManyAndReturnArgs>(args?: SelectSubset<T, ListingPerformanceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ListingPerformancePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ListingPerformance.
     * @param {ListingPerformanceDeleteArgs} args - Arguments to delete one ListingPerformance.
     * @example
     * // Delete one ListingPerformance
     * const ListingPerformance = await prisma.listingPerformance.delete({
     *   where: {
     *     // ... filter to delete one ListingPerformance
     *   }
     * })
     * 
     */
    delete<T extends ListingPerformanceDeleteArgs>(args: SelectSubset<T, ListingPerformanceDeleteArgs<ExtArgs>>): Prisma__ListingPerformanceClient<$Result.GetResult<Prisma.$ListingPerformancePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ListingPerformance.
     * @param {ListingPerformanceUpdateArgs} args - Arguments to update one ListingPerformance.
     * @example
     * // Update one ListingPerformance
     * const listingPerformance = await prisma.listingPerformance.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ListingPerformanceUpdateArgs>(args: SelectSubset<T, ListingPerformanceUpdateArgs<ExtArgs>>): Prisma__ListingPerformanceClient<$Result.GetResult<Prisma.$ListingPerformancePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ListingPerformances.
     * @param {ListingPerformanceDeleteManyArgs} args - Arguments to filter ListingPerformances to delete.
     * @example
     * // Delete a few ListingPerformances
     * const { count } = await prisma.listingPerformance.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ListingPerformanceDeleteManyArgs>(args?: SelectSubset<T, ListingPerformanceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ListingPerformances.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingPerformanceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ListingPerformances
     * const listingPerformance = await prisma.listingPerformance.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ListingPerformanceUpdateManyArgs>(args: SelectSubset<T, ListingPerformanceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ListingPerformance.
     * @param {ListingPerformanceUpsertArgs} args - Arguments to update or create a ListingPerformance.
     * @example
     * // Update or create a ListingPerformance
     * const listingPerformance = await prisma.listingPerformance.upsert({
     *   create: {
     *     // ... data to create a ListingPerformance
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ListingPerformance we want to update
     *   }
     * })
     */
    upsert<T extends ListingPerformanceUpsertArgs>(args: SelectSubset<T, ListingPerformanceUpsertArgs<ExtArgs>>): Prisma__ListingPerformanceClient<$Result.GetResult<Prisma.$ListingPerformancePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ListingPerformances.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingPerformanceCountArgs} args - Arguments to filter ListingPerformances to count.
     * @example
     * // Count the number of ListingPerformances
     * const count = await prisma.listingPerformance.count({
     *   where: {
     *     // ... the filter for the ListingPerformances we want to count
     *   }
     * })
    **/
    count<T extends ListingPerformanceCountArgs>(
      args?: Subset<T, ListingPerformanceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ListingPerformanceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ListingPerformance.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingPerformanceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ListingPerformanceAggregateArgs>(args: Subset<T, ListingPerformanceAggregateArgs>): Prisma.PrismaPromise<GetListingPerformanceAggregateType<T>>

    /**
     * Group by ListingPerformance.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingPerformanceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ListingPerformanceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ListingPerformanceGroupByArgs['orderBy'] }
        : { orderBy?: ListingPerformanceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ListingPerformanceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetListingPerformanceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ListingPerformance model
   */
  readonly fields: ListingPerformanceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ListingPerformance.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ListingPerformanceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ListingPerformance model
   */ 
  interface ListingPerformanceFieldRefs {
    readonly id: FieldRef<"ListingPerformance", 'String'>
    readonly listingId: FieldRef<"ListingPerformance", 'String'>
    readonly impressions: FieldRef<"ListingPerformance", 'Int'>
    readonly clicks: FieldRef<"ListingPerformance", 'Int'>
    readonly ctr: FieldRef<"ListingPerformance", 'Float'>
    readonly conversions: FieldRef<"ListingPerformance", 'Int'>
    readonly revenue: FieldRef<"ListingPerformance", 'Float'>
    readonly visualBatchMetrics: FieldRef<"ListingPerformance", 'Json'>
    readonly visualStrategyMetrics: FieldRef<"ListingPerformance", 'Json'>
    readonly visualReleaseGate: FieldRef<"ListingPerformance", 'Json'>
    readonly observedAt: FieldRef<"ListingPerformance", 'DateTime'>
    readonly createdAt: FieldRef<"ListingPerformance", 'DateTime'>
    readonly updatedAt: FieldRef<"ListingPerformance", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ListingPerformance findUnique
   */
  export type ListingPerformanceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ListingPerformance
     */
    select?: ListingPerformanceSelect<ExtArgs> | null
    /**
     * Filter, which ListingPerformance to fetch.
     */
    where: ListingPerformanceWhereUniqueInput
  }

  /**
   * ListingPerformance findUniqueOrThrow
   */
  export type ListingPerformanceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ListingPerformance
     */
    select?: ListingPerformanceSelect<ExtArgs> | null
    /**
     * Filter, which ListingPerformance to fetch.
     */
    where: ListingPerformanceWhereUniqueInput
  }

  /**
   * ListingPerformance findFirst
   */
  export type ListingPerformanceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ListingPerformance
     */
    select?: ListingPerformanceSelect<ExtArgs> | null
    /**
     * Filter, which ListingPerformance to fetch.
     */
    where?: ListingPerformanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ListingPerformances to fetch.
     */
    orderBy?: ListingPerformanceOrderByWithRelationInput | ListingPerformanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ListingPerformances.
     */
    cursor?: ListingPerformanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ListingPerformances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ListingPerformances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ListingPerformances.
     */
    distinct?: ListingPerformanceScalarFieldEnum | ListingPerformanceScalarFieldEnum[]
  }

  /**
   * ListingPerformance findFirstOrThrow
   */
  export type ListingPerformanceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ListingPerformance
     */
    select?: ListingPerformanceSelect<ExtArgs> | null
    /**
     * Filter, which ListingPerformance to fetch.
     */
    where?: ListingPerformanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ListingPerformances to fetch.
     */
    orderBy?: ListingPerformanceOrderByWithRelationInput | ListingPerformanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ListingPerformances.
     */
    cursor?: ListingPerformanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ListingPerformances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ListingPerformances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ListingPerformances.
     */
    distinct?: ListingPerformanceScalarFieldEnum | ListingPerformanceScalarFieldEnum[]
  }

  /**
   * ListingPerformance findMany
   */
  export type ListingPerformanceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ListingPerformance
     */
    select?: ListingPerformanceSelect<ExtArgs> | null
    /**
     * Filter, which ListingPerformances to fetch.
     */
    where?: ListingPerformanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ListingPerformances to fetch.
     */
    orderBy?: ListingPerformanceOrderByWithRelationInput | ListingPerformanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ListingPerformances.
     */
    cursor?: ListingPerformanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ListingPerformances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ListingPerformances.
     */
    skip?: number
    distinct?: ListingPerformanceScalarFieldEnum | ListingPerformanceScalarFieldEnum[]
  }

  /**
   * ListingPerformance create
   */
  export type ListingPerformanceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ListingPerformance
     */
    select?: ListingPerformanceSelect<ExtArgs> | null
    /**
     * The data needed to create a ListingPerformance.
     */
    data: XOR<ListingPerformanceCreateInput, ListingPerformanceUncheckedCreateInput>
  }

  /**
   * ListingPerformance createMany
   */
  export type ListingPerformanceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ListingPerformances.
     */
    data: ListingPerformanceCreateManyInput | ListingPerformanceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ListingPerformance createManyAndReturn
   */
  export type ListingPerformanceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ListingPerformance
     */
    select?: ListingPerformanceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ListingPerformances.
     */
    data: ListingPerformanceCreateManyInput | ListingPerformanceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ListingPerformance update
   */
  export type ListingPerformanceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ListingPerformance
     */
    select?: ListingPerformanceSelect<ExtArgs> | null
    /**
     * The data needed to update a ListingPerformance.
     */
    data: XOR<ListingPerformanceUpdateInput, ListingPerformanceUncheckedUpdateInput>
    /**
     * Choose, which ListingPerformance to update.
     */
    where: ListingPerformanceWhereUniqueInput
  }

  /**
   * ListingPerformance updateMany
   */
  export type ListingPerformanceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ListingPerformances.
     */
    data: XOR<ListingPerformanceUpdateManyMutationInput, ListingPerformanceUncheckedUpdateManyInput>
    /**
     * Filter which ListingPerformances to update
     */
    where?: ListingPerformanceWhereInput
  }

  /**
   * ListingPerformance upsert
   */
  export type ListingPerformanceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ListingPerformance
     */
    select?: ListingPerformanceSelect<ExtArgs> | null
    /**
     * The filter to search for the ListingPerformance to update in case it exists.
     */
    where: ListingPerformanceWhereUniqueInput
    /**
     * In case the ListingPerformance found by the `where` argument doesn't exist, create a new ListingPerformance with this data.
     */
    create: XOR<ListingPerformanceCreateInput, ListingPerformanceUncheckedCreateInput>
    /**
     * In case the ListingPerformance was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ListingPerformanceUpdateInput, ListingPerformanceUncheckedUpdateInput>
  }

  /**
   * ListingPerformance delete
   */
  export type ListingPerformanceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ListingPerformance
     */
    select?: ListingPerformanceSelect<ExtArgs> | null
    /**
     * Filter which ListingPerformance to delete.
     */
    where: ListingPerformanceWhereUniqueInput
  }

  /**
   * ListingPerformance deleteMany
   */
  export type ListingPerformanceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ListingPerformances to delete
     */
    where?: ListingPerformanceWhereInput
  }

  /**
   * ListingPerformance without action
   */
  export type ListingPerformanceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ListingPerformance
     */
    select?: ListingPerformanceSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const AccountScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    type: 'type',
    provider: 'provider',
    providerAccountId: 'providerAccountId',
    refresh_token: 'refresh_token',
    access_token: 'access_token',
    expires_at: 'expires_at',
    token_type: 'token_type',
    scope: 'scope',
    id_token: 'id_token',
    session_state: 'session_state'
  };

  export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum]


  export const SessionScalarFieldEnum: {
    id: 'id',
    sessionToken: 'sessionToken',
    userId: 'userId',
    expires: 'expires'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const VerificationTokenScalarFieldEnum: {
    identifier: 'identifier',
    token: 'token',
    expires: 'expires'
  };

  export type VerificationTokenScalarFieldEnum = (typeof VerificationTokenScalarFieldEnum)[keyof typeof VerificationTokenScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    emailVerified: 'emailVerified',
    image: 'image',
    password: 'password',
    role: 'role',
    merchBrand: 'merchBrand',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const WorkspaceScalarFieldEnum: {
    id: 'id',
    name: 'name',
    ownerId: 'ownerId',
    createdAt: 'createdAt'
  };

  export type WorkspaceScalarFieldEnum = (typeof WorkspaceScalarFieldEnum)[keyof typeof WorkspaceScalarFieldEnum]


  export const WorkspaceMemberScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    workspaceId: 'workspaceId',
    role: 'role'
  };

  export type WorkspaceMemberScalarFieldEnum = (typeof WorkspaceMemberScalarFieldEnum)[keyof typeof WorkspaceMemberScalarFieldEnum]


  export const ProjectScalarFieldEnum: {
    id: 'id',
    name: 'name',
    workspaceId: 'workspaceId',
    createdAt: 'createdAt'
  };

  export type ProjectScalarFieldEnum = (typeof ProjectScalarFieldEnum)[keyof typeof ProjectScalarFieldEnum]


  export const NicheScalarFieldEnum: {
    id: 'id',
    name: 'name',
    score: 'score',
    trendScore: 'trendScore',
    competitionScore: 'competitionScore',
    projectId: 'projectId'
  };

  export type NicheScalarFieldEnum = (typeof NicheScalarFieldEnum)[keyof typeof NicheScalarFieldEnum]


  export const SubscriptionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    stripeCustomerId: 'stripeCustomerId',
    stripeSubId: 'stripeSubId',
    plan: 'plan',
    status: 'status',
    currentPeriodEnd: 'currentPeriodEnd'
  };

  export type SubscriptionScalarFieldEnum = (typeof SubscriptionScalarFieldEnum)[keyof typeof SubscriptionScalarFieldEnum]


  export const UsageMetricScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    type: 'type',
    value: 'value',
    createdAt: 'createdAt'
  };

  export type UsageMetricScalarFieldEnum = (typeof UsageMetricScalarFieldEnum)[keyof typeof UsageMetricScalarFieldEnum]


  export const AutopilotJobScalarFieldEnum: {
    id: 'id',
    status: 'status',
    workspaceId: 'workspaceId',
    createdAt: 'createdAt'
  };

  export type AutopilotJobScalarFieldEnum = (typeof AutopilotJobScalarFieldEnum)[keyof typeof AutopilotJobScalarFieldEnum]


  export const SignalSnapshotScalarFieldEnum: {
    id: 'id',
    source: 'source',
    snapshotKey: 'snapshotKey',
    data: 'data',
    fetchedAt: 'fetchedAt',
    expiresAt: 'expiresAt',
    confidence: 'confidence',
    status: 'status',
    transport: 'transport',
    details: 'details',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SignalSnapshotScalarFieldEnum = (typeof SignalSnapshotScalarFieldEnum)[keyof typeof SignalSnapshotScalarFieldEnum]


  export const SignalSourceHealthScalarFieldEnum: {
    id: 'id',
    source: 'source',
    status: 'status',
    failureCount: 'failureCount',
    lastSuccess: 'lastSuccess',
    lastFailure: 'lastFailure',
    cooldownUntil: 'cooldownUntil',
    lastError: 'lastError',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SignalSourceHealthScalarFieldEnum = (typeof SignalSourceHealthScalarFieldEnum)[keyof typeof SignalSourceHealthScalarFieldEnum]


  export const MerchOutcomeFeedbackScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    niche: 'niche',
    nicheKey: 'nicheKey',
    platform: 'platform',
    slogan: 'slogan',
    sloganKey: 'sloganKey',
    pattern: 'pattern',
    tags: 'tags',
    audience: 'audience',
    style: 'style',
    productTitle: 'productTitle',
    visualBatchMetrics: 'visualBatchMetrics',
    visualStrategyMetrics: 'visualStrategyMetrics',
    visualReleaseGate: 'visualReleaseGate',
    impressions: 'impressions',
    clicks: 'clicks',
    orders: 'orders',
    favorites: 'favorites',
    revenue: 'revenue',
    refunds: 'refunds',
    observedAt: 'observedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MerchOutcomeFeedbackScalarFieldEnum = (typeof MerchOutcomeFeedbackScalarFieldEnum)[keyof typeof MerchOutcomeFeedbackScalarFieldEnum]


  export const SloganPatternScalarFieldEnum: {
    id: 'id',
    niche: 'niche',
    pattern: 'pattern',
    score: 'score',
    uses: 'uses',
    impressions: 'impressions',
    clicks: 'clicks',
    sales: 'sales',
    ctr: 'ctr',
    conversion: 'conversion',
    lastSlogan: 'lastSlogan',
    nicheHints: 'nicheHints',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SloganPatternScalarFieldEnum = (typeof SloganPatternScalarFieldEnum)[keyof typeof SloganPatternScalarFieldEnum]


  export const MarketSignalScalarFieldEnum: {
    id: 'id',
    niche: 'niche',
    text: 'text',
    source: 'source',
    nicheKey: 'nicheKey',
    sloganKey: 'sloganKey',
    tagKey: 'tagKey',
    score: 'score',
    confidence: 'confidence',
    payload: 'payload',
    observedAt: 'observedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MarketSignalScalarFieldEnum = (typeof MarketSignalScalarFieldEnum)[keyof typeof MarketSignalScalarFieldEnum]


  export const ListingQueueScalarFieldEnum: {
    id: 'id',
    niche: 'niche',
    slogan: 'slogan',
    title: 'title',
    bullets: 'bullets',
    tags: 'tags',
    mockupPrompt: 'mockupPrompt',
    adHooks: 'adHooks',
    visualBatchMetrics: 'visualBatchMetrics',
    visualStrategyMetrics: 'visualStrategyMetrics',
    visualReleaseGate: 'visualReleaseGate',
    status: 'status',
    platform: 'platform',
    priorityScore: 'priorityScore',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ListingQueueScalarFieldEnum = (typeof ListingQueueScalarFieldEnum)[keyof typeof ListingQueueScalarFieldEnum]


  export const ListingPerformanceScalarFieldEnum: {
    id: 'id',
    listingId: 'listingId',
    impressions: 'impressions',
    clicks: 'clicks',
    ctr: 'ctr',
    conversions: 'conversions',
    revenue: 'revenue',
    visualBatchMetrics: 'visualBatchMetrics',
    visualStrategyMetrics: 'visualStrategyMetrics',
    visualReleaseGate: 'visualReleaseGate',
    observedAt: 'observedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ListingPerformanceScalarFieldEnum = (typeof ListingPerformanceScalarFieldEnum)[keyof typeof ListingPerformanceScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    
  /**
   * Deep Input Types
   */


  export type AccountWhereInput = {
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    id?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refresh_token?: StringNullableFilter<"Account"> | string | null
    access_token?: StringNullableFilter<"Account"> | string | null
    expires_at?: IntNullableFilter<"Account"> | number | null
    token_type?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    id_token?: StringNullableFilter<"Account"> | string | null
    session_state?: StringNullableFilter<"Account"> | string | null
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type AccountOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrderInput | SortOrder
    access_token?: SortOrderInput | SortOrder
    expires_at?: SortOrderInput | SortOrder
    token_type?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    id_token?: SortOrderInput | SortOrder
    session_state?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    provider_providerAccountId?: AccountProviderProviderAccountIdCompoundUniqueInput
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    userId?: StringFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refresh_token?: StringNullableFilter<"Account"> | string | null
    access_token?: StringNullableFilter<"Account"> | string | null
    expires_at?: IntNullableFilter<"Account"> | number | null
    token_type?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    id_token?: StringNullableFilter<"Account"> | string | null
    session_state?: StringNullableFilter<"Account"> | string | null
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id" | "provider_providerAccountId">

  export type AccountOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrderInput | SortOrder
    access_token?: SortOrderInput | SortOrder
    expires_at?: SortOrderInput | SortOrder
    token_type?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    id_token?: SortOrderInput | SortOrder
    session_state?: SortOrderInput | SortOrder
    _count?: AccountCountOrderByAggregateInput
    _avg?: AccountAvgOrderByAggregateInput
    _max?: AccountMaxOrderByAggregateInput
    _min?: AccountMinOrderByAggregateInput
    _sum?: AccountSumOrderByAggregateInput
  }

  export type AccountScalarWhereWithAggregatesInput = {
    AND?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    OR?: AccountScalarWhereWithAggregatesInput[]
    NOT?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Account"> | string
    userId?: StringWithAggregatesFilter<"Account"> | string
    type?: StringWithAggregatesFilter<"Account"> | string
    provider?: StringWithAggregatesFilter<"Account"> | string
    providerAccountId?: StringWithAggregatesFilter<"Account"> | string
    refresh_token?: StringNullableWithAggregatesFilter<"Account"> | string | null
    access_token?: StringNullableWithAggregatesFilter<"Account"> | string | null
    expires_at?: IntNullableWithAggregatesFilter<"Account"> | number | null
    token_type?: StringNullableWithAggregatesFilter<"Account"> | string | null
    scope?: StringNullableWithAggregatesFilter<"Account"> | string | null
    id_token?: StringNullableWithAggregatesFilter<"Account"> | string | null
    session_state?: StringNullableWithAggregatesFilter<"Account"> | string | null
  }

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    id?: StringFilter<"Session"> | string
    sessionToken?: StringFilter<"Session"> | string
    userId?: StringFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sessionToken?: string
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    userId?: StringFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id" | "sessionToken">

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    _count?: SessionCountOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    OR?: SessionScalarWhereWithAggregatesInput[]
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Session"> | string
    sessionToken?: StringWithAggregatesFilter<"Session"> | string
    userId?: StringWithAggregatesFilter<"Session"> | string
    expires?: DateTimeWithAggregatesFilter<"Session"> | Date | string
  }

  export type VerificationTokenWhereInput = {
    AND?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    OR?: VerificationTokenWhereInput[]
    NOT?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    identifier?: StringFilter<"VerificationToken"> | string
    token?: StringFilter<"VerificationToken"> | string
    expires?: DateTimeFilter<"VerificationToken"> | Date | string
  }

  export type VerificationTokenOrderByWithRelationInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type VerificationTokenWhereUniqueInput = Prisma.AtLeast<{
    token?: string
    identifier_token?: VerificationTokenIdentifierTokenCompoundUniqueInput
    AND?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    OR?: VerificationTokenWhereInput[]
    NOT?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    identifier?: StringFilter<"VerificationToken"> | string
    expires?: DateTimeFilter<"VerificationToken"> | Date | string
  }, "token" | "identifier_token">

  export type VerificationTokenOrderByWithAggregationInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
    _count?: VerificationTokenCountOrderByAggregateInput
    _max?: VerificationTokenMaxOrderByAggregateInput
    _min?: VerificationTokenMinOrderByAggregateInput
  }

  export type VerificationTokenScalarWhereWithAggregatesInput = {
    AND?: VerificationTokenScalarWhereWithAggregatesInput | VerificationTokenScalarWhereWithAggregatesInput[]
    OR?: VerificationTokenScalarWhereWithAggregatesInput[]
    NOT?: VerificationTokenScalarWhereWithAggregatesInput | VerificationTokenScalarWhereWithAggregatesInput[]
    identifier?: StringWithAggregatesFilter<"VerificationToken"> | string
    token?: StringWithAggregatesFilter<"VerificationToken"> | string
    expires?: DateTimeWithAggregatesFilter<"VerificationToken"> | Date | string
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    email?: StringNullableFilter<"User"> | string | null
    emailVerified?: DateTimeNullableFilter<"User"> | Date | string | null
    image?: StringNullableFilter<"User"> | string | null
    password?: StringNullableFilter<"User"> | string | null
    role?: StringFilter<"User"> | string
    merchBrand?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    accounts?: AccountListRelationFilter
    sessions?: SessionListRelationFilter
    subscriptions?: SubscriptionListRelationFilter
    workspaces?: WorkspaceMemberListRelationFilter
    merchOutcomeFeedback?: MerchOutcomeFeedbackListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    emailVerified?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    role?: SortOrder
    merchBrand?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    accounts?: AccountOrderByRelationAggregateInput
    sessions?: SessionOrderByRelationAggregateInput
    subscriptions?: SubscriptionOrderByRelationAggregateInput
    workspaces?: WorkspaceMemberOrderByRelationAggregateInput
    merchOutcomeFeedback?: MerchOutcomeFeedbackOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    emailVerified?: DateTimeNullableFilter<"User"> | Date | string | null
    image?: StringNullableFilter<"User"> | string | null
    password?: StringNullableFilter<"User"> | string | null
    role?: StringFilter<"User"> | string
    merchBrand?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    accounts?: AccountListRelationFilter
    sessions?: SessionListRelationFilter
    subscriptions?: SubscriptionListRelationFilter
    workspaces?: WorkspaceMemberListRelationFilter
    merchOutcomeFeedback?: MerchOutcomeFeedbackListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    emailVerified?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    role?: SortOrder
    merchBrand?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    email?: StringNullableWithAggregatesFilter<"User"> | string | null
    emailVerified?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    image?: StringNullableWithAggregatesFilter<"User"> | string | null
    password?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: StringWithAggregatesFilter<"User"> | string
    merchBrand?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type WorkspaceWhereInput = {
    AND?: WorkspaceWhereInput | WorkspaceWhereInput[]
    OR?: WorkspaceWhereInput[]
    NOT?: WorkspaceWhereInput | WorkspaceWhereInput[]
    id?: StringFilter<"Workspace"> | string
    name?: StringFilter<"Workspace"> | string
    ownerId?: StringFilter<"Workspace"> | string
    createdAt?: DateTimeFilter<"Workspace"> | Date | string
    projects?: ProjectListRelationFilter
    members?: WorkspaceMemberListRelationFilter
  }

  export type WorkspaceOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    projects?: ProjectOrderByRelationAggregateInput
    members?: WorkspaceMemberOrderByRelationAggregateInput
  }

  export type WorkspaceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: WorkspaceWhereInput | WorkspaceWhereInput[]
    OR?: WorkspaceWhereInput[]
    NOT?: WorkspaceWhereInput | WorkspaceWhereInput[]
    name?: StringFilter<"Workspace"> | string
    ownerId?: StringFilter<"Workspace"> | string
    createdAt?: DateTimeFilter<"Workspace"> | Date | string
    projects?: ProjectListRelationFilter
    members?: WorkspaceMemberListRelationFilter
  }, "id">

  export type WorkspaceOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    _count?: WorkspaceCountOrderByAggregateInput
    _max?: WorkspaceMaxOrderByAggregateInput
    _min?: WorkspaceMinOrderByAggregateInput
  }

  export type WorkspaceScalarWhereWithAggregatesInput = {
    AND?: WorkspaceScalarWhereWithAggregatesInput | WorkspaceScalarWhereWithAggregatesInput[]
    OR?: WorkspaceScalarWhereWithAggregatesInput[]
    NOT?: WorkspaceScalarWhereWithAggregatesInput | WorkspaceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Workspace"> | string
    name?: StringWithAggregatesFilter<"Workspace"> | string
    ownerId?: StringWithAggregatesFilter<"Workspace"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Workspace"> | Date | string
  }

  export type WorkspaceMemberWhereInput = {
    AND?: WorkspaceMemberWhereInput | WorkspaceMemberWhereInput[]
    OR?: WorkspaceMemberWhereInput[]
    NOT?: WorkspaceMemberWhereInput | WorkspaceMemberWhereInput[]
    id?: StringFilter<"WorkspaceMember"> | string
    userId?: StringFilter<"WorkspaceMember"> | string
    workspaceId?: StringFilter<"WorkspaceMember"> | string
    role?: StringFilter<"WorkspaceMember"> | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    workspace?: XOR<WorkspaceRelationFilter, WorkspaceWhereInput>
  }

  export type WorkspaceMemberOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    workspaceId?: SortOrder
    role?: SortOrder
    user?: UserOrderByWithRelationInput
    workspace?: WorkspaceOrderByWithRelationInput
  }

  export type WorkspaceMemberWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: WorkspaceMemberWhereInput | WorkspaceMemberWhereInput[]
    OR?: WorkspaceMemberWhereInput[]
    NOT?: WorkspaceMemberWhereInput | WorkspaceMemberWhereInput[]
    userId?: StringFilter<"WorkspaceMember"> | string
    workspaceId?: StringFilter<"WorkspaceMember"> | string
    role?: StringFilter<"WorkspaceMember"> | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    workspace?: XOR<WorkspaceRelationFilter, WorkspaceWhereInput>
  }, "id">

  export type WorkspaceMemberOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    workspaceId?: SortOrder
    role?: SortOrder
    _count?: WorkspaceMemberCountOrderByAggregateInput
    _max?: WorkspaceMemberMaxOrderByAggregateInput
    _min?: WorkspaceMemberMinOrderByAggregateInput
  }

  export type WorkspaceMemberScalarWhereWithAggregatesInput = {
    AND?: WorkspaceMemberScalarWhereWithAggregatesInput | WorkspaceMemberScalarWhereWithAggregatesInput[]
    OR?: WorkspaceMemberScalarWhereWithAggregatesInput[]
    NOT?: WorkspaceMemberScalarWhereWithAggregatesInput | WorkspaceMemberScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WorkspaceMember"> | string
    userId?: StringWithAggregatesFilter<"WorkspaceMember"> | string
    workspaceId?: StringWithAggregatesFilter<"WorkspaceMember"> | string
    role?: StringWithAggregatesFilter<"WorkspaceMember"> | string
  }

  export type ProjectWhereInput = {
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    id?: StringFilter<"Project"> | string
    name?: StringFilter<"Project"> | string
    workspaceId?: StringFilter<"Project"> | string
    createdAt?: DateTimeFilter<"Project"> | Date | string
    niches?: NicheListRelationFilter
    workspace?: XOR<WorkspaceRelationFilter, WorkspaceWhereInput>
  }

  export type ProjectOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    workspaceId?: SortOrder
    createdAt?: SortOrder
    niches?: NicheOrderByRelationAggregateInput
    workspace?: WorkspaceOrderByWithRelationInput
  }

  export type ProjectWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    name?: StringFilter<"Project"> | string
    workspaceId?: StringFilter<"Project"> | string
    createdAt?: DateTimeFilter<"Project"> | Date | string
    niches?: NicheListRelationFilter
    workspace?: XOR<WorkspaceRelationFilter, WorkspaceWhereInput>
  }, "id">

  export type ProjectOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    workspaceId?: SortOrder
    createdAt?: SortOrder
    _count?: ProjectCountOrderByAggregateInput
    _max?: ProjectMaxOrderByAggregateInput
    _min?: ProjectMinOrderByAggregateInput
  }

  export type ProjectScalarWhereWithAggregatesInput = {
    AND?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    OR?: ProjectScalarWhereWithAggregatesInput[]
    NOT?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Project"> | string
    name?: StringWithAggregatesFilter<"Project"> | string
    workspaceId?: StringWithAggregatesFilter<"Project"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Project"> | Date | string
  }

  export type NicheWhereInput = {
    AND?: NicheWhereInput | NicheWhereInput[]
    OR?: NicheWhereInput[]
    NOT?: NicheWhereInput | NicheWhereInput[]
    id?: StringFilter<"Niche"> | string
    name?: StringFilter<"Niche"> | string
    score?: FloatFilter<"Niche"> | number
    trendScore?: FloatFilter<"Niche"> | number
    competitionScore?: FloatFilter<"Niche"> | number
    projectId?: StringFilter<"Niche"> | string
    project?: XOR<ProjectRelationFilter, ProjectWhereInput>
  }

  export type NicheOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    score?: SortOrder
    trendScore?: SortOrder
    competitionScore?: SortOrder
    projectId?: SortOrder
    project?: ProjectOrderByWithRelationInput
  }

  export type NicheWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: NicheWhereInput | NicheWhereInput[]
    OR?: NicheWhereInput[]
    NOT?: NicheWhereInput | NicheWhereInput[]
    name?: StringFilter<"Niche"> | string
    score?: FloatFilter<"Niche"> | number
    trendScore?: FloatFilter<"Niche"> | number
    competitionScore?: FloatFilter<"Niche"> | number
    projectId?: StringFilter<"Niche"> | string
    project?: XOR<ProjectRelationFilter, ProjectWhereInput>
  }, "id">

  export type NicheOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    score?: SortOrder
    trendScore?: SortOrder
    competitionScore?: SortOrder
    projectId?: SortOrder
    _count?: NicheCountOrderByAggregateInput
    _avg?: NicheAvgOrderByAggregateInput
    _max?: NicheMaxOrderByAggregateInput
    _min?: NicheMinOrderByAggregateInput
    _sum?: NicheSumOrderByAggregateInput
  }

  export type NicheScalarWhereWithAggregatesInput = {
    AND?: NicheScalarWhereWithAggregatesInput | NicheScalarWhereWithAggregatesInput[]
    OR?: NicheScalarWhereWithAggregatesInput[]
    NOT?: NicheScalarWhereWithAggregatesInput | NicheScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Niche"> | string
    name?: StringWithAggregatesFilter<"Niche"> | string
    score?: FloatWithAggregatesFilter<"Niche"> | number
    trendScore?: FloatWithAggregatesFilter<"Niche"> | number
    competitionScore?: FloatWithAggregatesFilter<"Niche"> | number
    projectId?: StringWithAggregatesFilter<"Niche"> | string
  }

  export type SubscriptionWhereInput = {
    AND?: SubscriptionWhereInput | SubscriptionWhereInput[]
    OR?: SubscriptionWhereInput[]
    NOT?: SubscriptionWhereInput | SubscriptionWhereInput[]
    id?: StringFilter<"Subscription"> | string
    userId?: StringFilter<"Subscription"> | string
    stripeCustomerId?: StringNullableFilter<"Subscription"> | string | null
    stripeSubId?: StringNullableFilter<"Subscription"> | string | null
    plan?: StringFilter<"Subscription"> | string
    status?: StringFilter<"Subscription"> | string
    currentPeriodEnd?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type SubscriptionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    stripeCustomerId?: SortOrderInput | SortOrder
    stripeSubId?: SortOrderInput | SortOrder
    plan?: SortOrder
    status?: SortOrder
    currentPeriodEnd?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SubscriptionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SubscriptionWhereInput | SubscriptionWhereInput[]
    OR?: SubscriptionWhereInput[]
    NOT?: SubscriptionWhereInput | SubscriptionWhereInput[]
    userId?: StringFilter<"Subscription"> | string
    stripeCustomerId?: StringNullableFilter<"Subscription"> | string | null
    stripeSubId?: StringNullableFilter<"Subscription"> | string | null
    plan?: StringFilter<"Subscription"> | string
    status?: StringFilter<"Subscription"> | string
    currentPeriodEnd?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type SubscriptionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    stripeCustomerId?: SortOrderInput | SortOrder
    stripeSubId?: SortOrderInput | SortOrder
    plan?: SortOrder
    status?: SortOrder
    currentPeriodEnd?: SortOrderInput | SortOrder
    _count?: SubscriptionCountOrderByAggregateInput
    _max?: SubscriptionMaxOrderByAggregateInput
    _min?: SubscriptionMinOrderByAggregateInput
  }

  export type SubscriptionScalarWhereWithAggregatesInput = {
    AND?: SubscriptionScalarWhereWithAggregatesInput | SubscriptionScalarWhereWithAggregatesInput[]
    OR?: SubscriptionScalarWhereWithAggregatesInput[]
    NOT?: SubscriptionScalarWhereWithAggregatesInput | SubscriptionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Subscription"> | string
    userId?: StringWithAggregatesFilter<"Subscription"> | string
    stripeCustomerId?: StringNullableWithAggregatesFilter<"Subscription"> | string | null
    stripeSubId?: StringNullableWithAggregatesFilter<"Subscription"> | string | null
    plan?: StringWithAggregatesFilter<"Subscription"> | string
    status?: StringWithAggregatesFilter<"Subscription"> | string
    currentPeriodEnd?: DateTimeNullableWithAggregatesFilter<"Subscription"> | Date | string | null
  }

  export type UsageMetricWhereInput = {
    AND?: UsageMetricWhereInput | UsageMetricWhereInput[]
    OR?: UsageMetricWhereInput[]
    NOT?: UsageMetricWhereInput | UsageMetricWhereInput[]
    id?: StringFilter<"UsageMetric"> | string
    userId?: StringFilter<"UsageMetric"> | string
    type?: StringFilter<"UsageMetric"> | string
    value?: IntFilter<"UsageMetric"> | number
    createdAt?: DateTimeFilter<"UsageMetric"> | Date | string
  }

  export type UsageMetricOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
  }

  export type UsageMetricWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: UsageMetricWhereInput | UsageMetricWhereInput[]
    OR?: UsageMetricWhereInput[]
    NOT?: UsageMetricWhereInput | UsageMetricWhereInput[]
    userId?: StringFilter<"UsageMetric"> | string
    type?: StringFilter<"UsageMetric"> | string
    value?: IntFilter<"UsageMetric"> | number
    createdAt?: DateTimeFilter<"UsageMetric"> | Date | string
  }, "id">

  export type UsageMetricOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
    _count?: UsageMetricCountOrderByAggregateInput
    _avg?: UsageMetricAvgOrderByAggregateInput
    _max?: UsageMetricMaxOrderByAggregateInput
    _min?: UsageMetricMinOrderByAggregateInput
    _sum?: UsageMetricSumOrderByAggregateInput
  }

  export type UsageMetricScalarWhereWithAggregatesInput = {
    AND?: UsageMetricScalarWhereWithAggregatesInput | UsageMetricScalarWhereWithAggregatesInput[]
    OR?: UsageMetricScalarWhereWithAggregatesInput[]
    NOT?: UsageMetricScalarWhereWithAggregatesInput | UsageMetricScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UsageMetric"> | string
    userId?: StringWithAggregatesFilter<"UsageMetric"> | string
    type?: StringWithAggregatesFilter<"UsageMetric"> | string
    value?: IntWithAggregatesFilter<"UsageMetric"> | number
    createdAt?: DateTimeWithAggregatesFilter<"UsageMetric"> | Date | string
  }

  export type AutopilotJobWhereInput = {
    AND?: AutopilotJobWhereInput | AutopilotJobWhereInput[]
    OR?: AutopilotJobWhereInput[]
    NOT?: AutopilotJobWhereInput | AutopilotJobWhereInput[]
    id?: StringFilter<"AutopilotJob"> | string
    status?: StringFilter<"AutopilotJob"> | string
    workspaceId?: StringFilter<"AutopilotJob"> | string
    createdAt?: DateTimeFilter<"AutopilotJob"> | Date | string
  }

  export type AutopilotJobOrderByWithRelationInput = {
    id?: SortOrder
    status?: SortOrder
    workspaceId?: SortOrder
    createdAt?: SortOrder
  }

  export type AutopilotJobWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AutopilotJobWhereInput | AutopilotJobWhereInput[]
    OR?: AutopilotJobWhereInput[]
    NOT?: AutopilotJobWhereInput | AutopilotJobWhereInput[]
    status?: StringFilter<"AutopilotJob"> | string
    workspaceId?: StringFilter<"AutopilotJob"> | string
    createdAt?: DateTimeFilter<"AutopilotJob"> | Date | string
  }, "id">

  export type AutopilotJobOrderByWithAggregationInput = {
    id?: SortOrder
    status?: SortOrder
    workspaceId?: SortOrder
    createdAt?: SortOrder
    _count?: AutopilotJobCountOrderByAggregateInput
    _max?: AutopilotJobMaxOrderByAggregateInput
    _min?: AutopilotJobMinOrderByAggregateInput
  }

  export type AutopilotJobScalarWhereWithAggregatesInput = {
    AND?: AutopilotJobScalarWhereWithAggregatesInput | AutopilotJobScalarWhereWithAggregatesInput[]
    OR?: AutopilotJobScalarWhereWithAggregatesInput[]
    NOT?: AutopilotJobScalarWhereWithAggregatesInput | AutopilotJobScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AutopilotJob"> | string
    status?: StringWithAggregatesFilter<"AutopilotJob"> | string
    workspaceId?: StringWithAggregatesFilter<"AutopilotJob"> | string
    createdAt?: DateTimeWithAggregatesFilter<"AutopilotJob"> | Date | string
  }

  export type SignalSnapshotWhereInput = {
    AND?: SignalSnapshotWhereInput | SignalSnapshotWhereInput[]
    OR?: SignalSnapshotWhereInput[]
    NOT?: SignalSnapshotWhereInput | SignalSnapshotWhereInput[]
    id?: StringFilter<"SignalSnapshot"> | string
    source?: StringFilter<"SignalSnapshot"> | string
    snapshotKey?: StringFilter<"SignalSnapshot"> | string
    data?: JsonFilter<"SignalSnapshot">
    fetchedAt?: DateTimeFilter<"SignalSnapshot"> | Date | string
    expiresAt?: DateTimeFilter<"SignalSnapshot"> | Date | string
    confidence?: FloatFilter<"SignalSnapshot"> | number
    status?: StringFilter<"SignalSnapshot"> | string
    transport?: StringFilter<"SignalSnapshot"> | string
    details?: StringNullableFilter<"SignalSnapshot"> | string | null
    createdAt?: DateTimeFilter<"SignalSnapshot"> | Date | string
    updatedAt?: DateTimeFilter<"SignalSnapshot"> | Date | string
  }

  export type SignalSnapshotOrderByWithRelationInput = {
    id?: SortOrder
    source?: SortOrder
    snapshotKey?: SortOrder
    data?: SortOrder
    fetchedAt?: SortOrder
    expiresAt?: SortOrder
    confidence?: SortOrder
    status?: SortOrder
    transport?: SortOrder
    details?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SignalSnapshotWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    source_snapshotKey?: SignalSnapshotSourceSnapshotKeyCompoundUniqueInput
    AND?: SignalSnapshotWhereInput | SignalSnapshotWhereInput[]
    OR?: SignalSnapshotWhereInput[]
    NOT?: SignalSnapshotWhereInput | SignalSnapshotWhereInput[]
    source?: StringFilter<"SignalSnapshot"> | string
    snapshotKey?: StringFilter<"SignalSnapshot"> | string
    data?: JsonFilter<"SignalSnapshot">
    fetchedAt?: DateTimeFilter<"SignalSnapshot"> | Date | string
    expiresAt?: DateTimeFilter<"SignalSnapshot"> | Date | string
    confidence?: FloatFilter<"SignalSnapshot"> | number
    status?: StringFilter<"SignalSnapshot"> | string
    transport?: StringFilter<"SignalSnapshot"> | string
    details?: StringNullableFilter<"SignalSnapshot"> | string | null
    createdAt?: DateTimeFilter<"SignalSnapshot"> | Date | string
    updatedAt?: DateTimeFilter<"SignalSnapshot"> | Date | string
  }, "id" | "source_snapshotKey">

  export type SignalSnapshotOrderByWithAggregationInput = {
    id?: SortOrder
    source?: SortOrder
    snapshotKey?: SortOrder
    data?: SortOrder
    fetchedAt?: SortOrder
    expiresAt?: SortOrder
    confidence?: SortOrder
    status?: SortOrder
    transport?: SortOrder
    details?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SignalSnapshotCountOrderByAggregateInput
    _avg?: SignalSnapshotAvgOrderByAggregateInput
    _max?: SignalSnapshotMaxOrderByAggregateInput
    _min?: SignalSnapshotMinOrderByAggregateInput
    _sum?: SignalSnapshotSumOrderByAggregateInput
  }

  export type SignalSnapshotScalarWhereWithAggregatesInput = {
    AND?: SignalSnapshotScalarWhereWithAggregatesInput | SignalSnapshotScalarWhereWithAggregatesInput[]
    OR?: SignalSnapshotScalarWhereWithAggregatesInput[]
    NOT?: SignalSnapshotScalarWhereWithAggregatesInput | SignalSnapshotScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SignalSnapshot"> | string
    source?: StringWithAggregatesFilter<"SignalSnapshot"> | string
    snapshotKey?: StringWithAggregatesFilter<"SignalSnapshot"> | string
    data?: JsonWithAggregatesFilter<"SignalSnapshot">
    fetchedAt?: DateTimeWithAggregatesFilter<"SignalSnapshot"> | Date | string
    expiresAt?: DateTimeWithAggregatesFilter<"SignalSnapshot"> | Date | string
    confidence?: FloatWithAggregatesFilter<"SignalSnapshot"> | number
    status?: StringWithAggregatesFilter<"SignalSnapshot"> | string
    transport?: StringWithAggregatesFilter<"SignalSnapshot"> | string
    details?: StringNullableWithAggregatesFilter<"SignalSnapshot"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"SignalSnapshot"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SignalSnapshot"> | Date | string
  }

  export type SignalSourceHealthWhereInput = {
    AND?: SignalSourceHealthWhereInput | SignalSourceHealthWhereInput[]
    OR?: SignalSourceHealthWhereInput[]
    NOT?: SignalSourceHealthWhereInput | SignalSourceHealthWhereInput[]
    id?: StringFilter<"SignalSourceHealth"> | string
    source?: StringFilter<"SignalSourceHealth"> | string
    status?: StringFilter<"SignalSourceHealth"> | string
    failureCount?: IntFilter<"SignalSourceHealth"> | number
    lastSuccess?: DateTimeNullableFilter<"SignalSourceHealth"> | Date | string | null
    lastFailure?: DateTimeNullableFilter<"SignalSourceHealth"> | Date | string | null
    cooldownUntil?: DateTimeNullableFilter<"SignalSourceHealth"> | Date | string | null
    lastError?: StringNullableFilter<"SignalSourceHealth"> | string | null
    createdAt?: DateTimeFilter<"SignalSourceHealth"> | Date | string
    updatedAt?: DateTimeFilter<"SignalSourceHealth"> | Date | string
  }

  export type SignalSourceHealthOrderByWithRelationInput = {
    id?: SortOrder
    source?: SortOrder
    status?: SortOrder
    failureCount?: SortOrder
    lastSuccess?: SortOrderInput | SortOrder
    lastFailure?: SortOrderInput | SortOrder
    cooldownUntil?: SortOrderInput | SortOrder
    lastError?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SignalSourceHealthWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    source?: string
    AND?: SignalSourceHealthWhereInput | SignalSourceHealthWhereInput[]
    OR?: SignalSourceHealthWhereInput[]
    NOT?: SignalSourceHealthWhereInput | SignalSourceHealthWhereInput[]
    status?: StringFilter<"SignalSourceHealth"> | string
    failureCount?: IntFilter<"SignalSourceHealth"> | number
    lastSuccess?: DateTimeNullableFilter<"SignalSourceHealth"> | Date | string | null
    lastFailure?: DateTimeNullableFilter<"SignalSourceHealth"> | Date | string | null
    cooldownUntil?: DateTimeNullableFilter<"SignalSourceHealth"> | Date | string | null
    lastError?: StringNullableFilter<"SignalSourceHealth"> | string | null
    createdAt?: DateTimeFilter<"SignalSourceHealth"> | Date | string
    updatedAt?: DateTimeFilter<"SignalSourceHealth"> | Date | string
  }, "id" | "source">

  export type SignalSourceHealthOrderByWithAggregationInput = {
    id?: SortOrder
    source?: SortOrder
    status?: SortOrder
    failureCount?: SortOrder
    lastSuccess?: SortOrderInput | SortOrder
    lastFailure?: SortOrderInput | SortOrder
    cooldownUntil?: SortOrderInput | SortOrder
    lastError?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SignalSourceHealthCountOrderByAggregateInput
    _avg?: SignalSourceHealthAvgOrderByAggregateInput
    _max?: SignalSourceHealthMaxOrderByAggregateInput
    _min?: SignalSourceHealthMinOrderByAggregateInput
    _sum?: SignalSourceHealthSumOrderByAggregateInput
  }

  export type SignalSourceHealthScalarWhereWithAggregatesInput = {
    AND?: SignalSourceHealthScalarWhereWithAggregatesInput | SignalSourceHealthScalarWhereWithAggregatesInput[]
    OR?: SignalSourceHealthScalarWhereWithAggregatesInput[]
    NOT?: SignalSourceHealthScalarWhereWithAggregatesInput | SignalSourceHealthScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SignalSourceHealth"> | string
    source?: StringWithAggregatesFilter<"SignalSourceHealth"> | string
    status?: StringWithAggregatesFilter<"SignalSourceHealth"> | string
    failureCount?: IntWithAggregatesFilter<"SignalSourceHealth"> | number
    lastSuccess?: DateTimeNullableWithAggregatesFilter<"SignalSourceHealth"> | Date | string | null
    lastFailure?: DateTimeNullableWithAggregatesFilter<"SignalSourceHealth"> | Date | string | null
    cooldownUntil?: DateTimeNullableWithAggregatesFilter<"SignalSourceHealth"> | Date | string | null
    lastError?: StringNullableWithAggregatesFilter<"SignalSourceHealth"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"SignalSourceHealth"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SignalSourceHealth"> | Date | string
  }

  export type MerchOutcomeFeedbackWhereInput = {
    AND?: MerchOutcomeFeedbackWhereInput | MerchOutcomeFeedbackWhereInput[]
    OR?: MerchOutcomeFeedbackWhereInput[]
    NOT?: MerchOutcomeFeedbackWhereInput | MerchOutcomeFeedbackWhereInput[]
    id?: StringFilter<"MerchOutcomeFeedback"> | string
    userId?: StringFilter<"MerchOutcomeFeedback"> | string
    niche?: StringFilter<"MerchOutcomeFeedback"> | string
    nicheKey?: StringFilter<"MerchOutcomeFeedback"> | string
    platform?: StringFilter<"MerchOutcomeFeedback"> | string
    slogan?: StringFilter<"MerchOutcomeFeedback"> | string
    sloganKey?: StringFilter<"MerchOutcomeFeedback"> | string
    pattern?: StringNullableFilter<"MerchOutcomeFeedback"> | string | null
    tags?: StringNullableListFilter<"MerchOutcomeFeedback">
    audience?: StringNullableFilter<"MerchOutcomeFeedback"> | string | null
    style?: StringNullableFilter<"MerchOutcomeFeedback"> | string | null
    productTitle?: StringNullableFilter<"MerchOutcomeFeedback"> | string | null
    visualBatchMetrics?: JsonNullableFilter<"MerchOutcomeFeedback">
    visualStrategyMetrics?: JsonNullableFilter<"MerchOutcomeFeedback">
    visualReleaseGate?: JsonNullableFilter<"MerchOutcomeFeedback">
    impressions?: IntFilter<"MerchOutcomeFeedback"> | number
    clicks?: IntFilter<"MerchOutcomeFeedback"> | number
    orders?: IntFilter<"MerchOutcomeFeedback"> | number
    favorites?: IntFilter<"MerchOutcomeFeedback"> | number
    revenue?: FloatFilter<"MerchOutcomeFeedback"> | number
    refunds?: IntFilter<"MerchOutcomeFeedback"> | number
    observedAt?: DateTimeFilter<"MerchOutcomeFeedback"> | Date | string
    createdAt?: DateTimeFilter<"MerchOutcomeFeedback"> | Date | string
    updatedAt?: DateTimeFilter<"MerchOutcomeFeedback"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type MerchOutcomeFeedbackOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    niche?: SortOrder
    nicheKey?: SortOrder
    platform?: SortOrder
    slogan?: SortOrder
    sloganKey?: SortOrder
    pattern?: SortOrderInput | SortOrder
    tags?: SortOrder
    audience?: SortOrderInput | SortOrder
    style?: SortOrderInput | SortOrder
    productTitle?: SortOrderInput | SortOrder
    visualBatchMetrics?: SortOrderInput | SortOrder
    visualStrategyMetrics?: SortOrderInput | SortOrder
    visualReleaseGate?: SortOrderInput | SortOrder
    impressions?: SortOrder
    clicks?: SortOrder
    orders?: SortOrder
    favorites?: SortOrder
    revenue?: SortOrder
    refunds?: SortOrder
    observedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type MerchOutcomeFeedbackWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MerchOutcomeFeedbackWhereInput | MerchOutcomeFeedbackWhereInput[]
    OR?: MerchOutcomeFeedbackWhereInput[]
    NOT?: MerchOutcomeFeedbackWhereInput | MerchOutcomeFeedbackWhereInput[]
    userId?: StringFilter<"MerchOutcomeFeedback"> | string
    niche?: StringFilter<"MerchOutcomeFeedback"> | string
    nicheKey?: StringFilter<"MerchOutcomeFeedback"> | string
    platform?: StringFilter<"MerchOutcomeFeedback"> | string
    slogan?: StringFilter<"MerchOutcomeFeedback"> | string
    sloganKey?: StringFilter<"MerchOutcomeFeedback"> | string
    pattern?: StringNullableFilter<"MerchOutcomeFeedback"> | string | null
    tags?: StringNullableListFilter<"MerchOutcomeFeedback">
    audience?: StringNullableFilter<"MerchOutcomeFeedback"> | string | null
    style?: StringNullableFilter<"MerchOutcomeFeedback"> | string | null
    productTitle?: StringNullableFilter<"MerchOutcomeFeedback"> | string | null
    visualBatchMetrics?: JsonNullableFilter<"MerchOutcomeFeedback">
    visualStrategyMetrics?: JsonNullableFilter<"MerchOutcomeFeedback">
    visualReleaseGate?: JsonNullableFilter<"MerchOutcomeFeedback">
    impressions?: IntFilter<"MerchOutcomeFeedback"> | number
    clicks?: IntFilter<"MerchOutcomeFeedback"> | number
    orders?: IntFilter<"MerchOutcomeFeedback"> | number
    favorites?: IntFilter<"MerchOutcomeFeedback"> | number
    revenue?: FloatFilter<"MerchOutcomeFeedback"> | number
    refunds?: IntFilter<"MerchOutcomeFeedback"> | number
    observedAt?: DateTimeFilter<"MerchOutcomeFeedback"> | Date | string
    createdAt?: DateTimeFilter<"MerchOutcomeFeedback"> | Date | string
    updatedAt?: DateTimeFilter<"MerchOutcomeFeedback"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type MerchOutcomeFeedbackOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    niche?: SortOrder
    nicheKey?: SortOrder
    platform?: SortOrder
    slogan?: SortOrder
    sloganKey?: SortOrder
    pattern?: SortOrderInput | SortOrder
    tags?: SortOrder
    audience?: SortOrderInput | SortOrder
    style?: SortOrderInput | SortOrder
    productTitle?: SortOrderInput | SortOrder
    visualBatchMetrics?: SortOrderInput | SortOrder
    visualStrategyMetrics?: SortOrderInput | SortOrder
    visualReleaseGate?: SortOrderInput | SortOrder
    impressions?: SortOrder
    clicks?: SortOrder
    orders?: SortOrder
    favorites?: SortOrder
    revenue?: SortOrder
    refunds?: SortOrder
    observedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MerchOutcomeFeedbackCountOrderByAggregateInput
    _avg?: MerchOutcomeFeedbackAvgOrderByAggregateInput
    _max?: MerchOutcomeFeedbackMaxOrderByAggregateInput
    _min?: MerchOutcomeFeedbackMinOrderByAggregateInput
    _sum?: MerchOutcomeFeedbackSumOrderByAggregateInput
  }

  export type MerchOutcomeFeedbackScalarWhereWithAggregatesInput = {
    AND?: MerchOutcomeFeedbackScalarWhereWithAggregatesInput | MerchOutcomeFeedbackScalarWhereWithAggregatesInput[]
    OR?: MerchOutcomeFeedbackScalarWhereWithAggregatesInput[]
    NOT?: MerchOutcomeFeedbackScalarWhereWithAggregatesInput | MerchOutcomeFeedbackScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MerchOutcomeFeedback"> | string
    userId?: StringWithAggregatesFilter<"MerchOutcomeFeedback"> | string
    niche?: StringWithAggregatesFilter<"MerchOutcomeFeedback"> | string
    nicheKey?: StringWithAggregatesFilter<"MerchOutcomeFeedback"> | string
    platform?: StringWithAggregatesFilter<"MerchOutcomeFeedback"> | string
    slogan?: StringWithAggregatesFilter<"MerchOutcomeFeedback"> | string
    sloganKey?: StringWithAggregatesFilter<"MerchOutcomeFeedback"> | string
    pattern?: StringNullableWithAggregatesFilter<"MerchOutcomeFeedback"> | string | null
    tags?: StringNullableListFilter<"MerchOutcomeFeedback">
    audience?: StringNullableWithAggregatesFilter<"MerchOutcomeFeedback"> | string | null
    style?: StringNullableWithAggregatesFilter<"MerchOutcomeFeedback"> | string | null
    productTitle?: StringNullableWithAggregatesFilter<"MerchOutcomeFeedback"> | string | null
    visualBatchMetrics?: JsonNullableWithAggregatesFilter<"MerchOutcomeFeedback">
    visualStrategyMetrics?: JsonNullableWithAggregatesFilter<"MerchOutcomeFeedback">
    visualReleaseGate?: JsonNullableWithAggregatesFilter<"MerchOutcomeFeedback">
    impressions?: IntWithAggregatesFilter<"MerchOutcomeFeedback"> | number
    clicks?: IntWithAggregatesFilter<"MerchOutcomeFeedback"> | number
    orders?: IntWithAggregatesFilter<"MerchOutcomeFeedback"> | number
    favorites?: IntWithAggregatesFilter<"MerchOutcomeFeedback"> | number
    revenue?: FloatWithAggregatesFilter<"MerchOutcomeFeedback"> | number
    refunds?: IntWithAggregatesFilter<"MerchOutcomeFeedback"> | number
    observedAt?: DateTimeWithAggregatesFilter<"MerchOutcomeFeedback"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"MerchOutcomeFeedback"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"MerchOutcomeFeedback"> | Date | string
  }

  export type SloganPatternWhereInput = {
    AND?: SloganPatternWhereInput | SloganPatternWhereInput[]
    OR?: SloganPatternWhereInput[]
    NOT?: SloganPatternWhereInput | SloganPatternWhereInput[]
    id?: StringFilter<"SloganPattern"> | string
    niche?: StringFilter<"SloganPattern"> | string
    pattern?: StringFilter<"SloganPattern"> | string
    score?: FloatFilter<"SloganPattern"> | number
    uses?: IntFilter<"SloganPattern"> | number
    impressions?: IntFilter<"SloganPattern"> | number
    clicks?: IntFilter<"SloganPattern"> | number
    sales?: IntFilter<"SloganPattern"> | number
    ctr?: FloatFilter<"SloganPattern"> | number
    conversion?: FloatFilter<"SloganPattern"> | number
    lastSlogan?: StringNullableFilter<"SloganPattern"> | string | null
    nicheHints?: StringNullableListFilter<"SloganPattern">
    createdAt?: DateTimeFilter<"SloganPattern"> | Date | string
    updatedAt?: DateTimeFilter<"SloganPattern"> | Date | string
  }

  export type SloganPatternOrderByWithRelationInput = {
    id?: SortOrder
    niche?: SortOrder
    pattern?: SortOrder
    score?: SortOrder
    uses?: SortOrder
    impressions?: SortOrder
    clicks?: SortOrder
    sales?: SortOrder
    ctr?: SortOrder
    conversion?: SortOrder
    lastSlogan?: SortOrderInput | SortOrder
    nicheHints?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SloganPatternWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    niche_pattern?: SloganPatternNichePatternCompoundUniqueInput
    AND?: SloganPatternWhereInput | SloganPatternWhereInput[]
    OR?: SloganPatternWhereInput[]
    NOT?: SloganPatternWhereInput | SloganPatternWhereInput[]
    niche?: StringFilter<"SloganPattern"> | string
    pattern?: StringFilter<"SloganPattern"> | string
    score?: FloatFilter<"SloganPattern"> | number
    uses?: IntFilter<"SloganPattern"> | number
    impressions?: IntFilter<"SloganPattern"> | number
    clicks?: IntFilter<"SloganPattern"> | number
    sales?: IntFilter<"SloganPattern"> | number
    ctr?: FloatFilter<"SloganPattern"> | number
    conversion?: FloatFilter<"SloganPattern"> | number
    lastSlogan?: StringNullableFilter<"SloganPattern"> | string | null
    nicheHints?: StringNullableListFilter<"SloganPattern">
    createdAt?: DateTimeFilter<"SloganPattern"> | Date | string
    updatedAt?: DateTimeFilter<"SloganPattern"> | Date | string
  }, "id" | "niche_pattern">

  export type SloganPatternOrderByWithAggregationInput = {
    id?: SortOrder
    niche?: SortOrder
    pattern?: SortOrder
    score?: SortOrder
    uses?: SortOrder
    impressions?: SortOrder
    clicks?: SortOrder
    sales?: SortOrder
    ctr?: SortOrder
    conversion?: SortOrder
    lastSlogan?: SortOrderInput | SortOrder
    nicheHints?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SloganPatternCountOrderByAggregateInput
    _avg?: SloganPatternAvgOrderByAggregateInput
    _max?: SloganPatternMaxOrderByAggregateInput
    _min?: SloganPatternMinOrderByAggregateInput
    _sum?: SloganPatternSumOrderByAggregateInput
  }

  export type SloganPatternScalarWhereWithAggregatesInput = {
    AND?: SloganPatternScalarWhereWithAggregatesInput | SloganPatternScalarWhereWithAggregatesInput[]
    OR?: SloganPatternScalarWhereWithAggregatesInput[]
    NOT?: SloganPatternScalarWhereWithAggregatesInput | SloganPatternScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SloganPattern"> | string
    niche?: StringWithAggregatesFilter<"SloganPattern"> | string
    pattern?: StringWithAggregatesFilter<"SloganPattern"> | string
    score?: FloatWithAggregatesFilter<"SloganPattern"> | number
    uses?: IntWithAggregatesFilter<"SloganPattern"> | number
    impressions?: IntWithAggregatesFilter<"SloganPattern"> | number
    clicks?: IntWithAggregatesFilter<"SloganPattern"> | number
    sales?: IntWithAggregatesFilter<"SloganPattern"> | number
    ctr?: FloatWithAggregatesFilter<"SloganPattern"> | number
    conversion?: FloatWithAggregatesFilter<"SloganPattern"> | number
    lastSlogan?: StringNullableWithAggregatesFilter<"SloganPattern"> | string | null
    nicheHints?: StringNullableListFilter<"SloganPattern">
    createdAt?: DateTimeWithAggregatesFilter<"SloganPattern"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SloganPattern"> | Date | string
  }

  export type MarketSignalWhereInput = {
    AND?: MarketSignalWhereInput | MarketSignalWhereInput[]
    OR?: MarketSignalWhereInput[]
    NOT?: MarketSignalWhereInput | MarketSignalWhereInput[]
    id?: StringFilter<"MarketSignal"> | string
    niche?: StringFilter<"MarketSignal"> | string
    text?: StringFilter<"MarketSignal"> | string
    source?: StringFilter<"MarketSignal"> | string
    nicheKey?: StringNullableFilter<"MarketSignal"> | string | null
    sloganKey?: StringNullableFilter<"MarketSignal"> | string | null
    tagKey?: StringNullableFilter<"MarketSignal"> | string | null
    score?: FloatFilter<"MarketSignal"> | number
    confidence?: FloatFilter<"MarketSignal"> | number
    payload?: JsonNullableFilter<"MarketSignal">
    observedAt?: DateTimeFilter<"MarketSignal"> | Date | string
    createdAt?: DateTimeFilter<"MarketSignal"> | Date | string
    updatedAt?: DateTimeFilter<"MarketSignal"> | Date | string
  }

  export type MarketSignalOrderByWithRelationInput = {
    id?: SortOrder
    niche?: SortOrder
    text?: SortOrder
    source?: SortOrder
    nicheKey?: SortOrderInput | SortOrder
    sloganKey?: SortOrderInput | SortOrder
    tagKey?: SortOrderInput | SortOrder
    score?: SortOrder
    confidence?: SortOrder
    payload?: SortOrderInput | SortOrder
    observedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MarketSignalWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MarketSignalWhereInput | MarketSignalWhereInput[]
    OR?: MarketSignalWhereInput[]
    NOT?: MarketSignalWhereInput | MarketSignalWhereInput[]
    niche?: StringFilter<"MarketSignal"> | string
    text?: StringFilter<"MarketSignal"> | string
    source?: StringFilter<"MarketSignal"> | string
    nicheKey?: StringNullableFilter<"MarketSignal"> | string | null
    sloganKey?: StringNullableFilter<"MarketSignal"> | string | null
    tagKey?: StringNullableFilter<"MarketSignal"> | string | null
    score?: FloatFilter<"MarketSignal"> | number
    confidence?: FloatFilter<"MarketSignal"> | number
    payload?: JsonNullableFilter<"MarketSignal">
    observedAt?: DateTimeFilter<"MarketSignal"> | Date | string
    createdAt?: DateTimeFilter<"MarketSignal"> | Date | string
    updatedAt?: DateTimeFilter<"MarketSignal"> | Date | string
  }, "id">

  export type MarketSignalOrderByWithAggregationInput = {
    id?: SortOrder
    niche?: SortOrder
    text?: SortOrder
    source?: SortOrder
    nicheKey?: SortOrderInput | SortOrder
    sloganKey?: SortOrderInput | SortOrder
    tagKey?: SortOrderInput | SortOrder
    score?: SortOrder
    confidence?: SortOrder
    payload?: SortOrderInput | SortOrder
    observedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MarketSignalCountOrderByAggregateInput
    _avg?: MarketSignalAvgOrderByAggregateInput
    _max?: MarketSignalMaxOrderByAggregateInput
    _min?: MarketSignalMinOrderByAggregateInput
    _sum?: MarketSignalSumOrderByAggregateInput
  }

  export type MarketSignalScalarWhereWithAggregatesInput = {
    AND?: MarketSignalScalarWhereWithAggregatesInput | MarketSignalScalarWhereWithAggregatesInput[]
    OR?: MarketSignalScalarWhereWithAggregatesInput[]
    NOT?: MarketSignalScalarWhereWithAggregatesInput | MarketSignalScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MarketSignal"> | string
    niche?: StringWithAggregatesFilter<"MarketSignal"> | string
    text?: StringWithAggregatesFilter<"MarketSignal"> | string
    source?: StringWithAggregatesFilter<"MarketSignal"> | string
    nicheKey?: StringNullableWithAggregatesFilter<"MarketSignal"> | string | null
    sloganKey?: StringNullableWithAggregatesFilter<"MarketSignal"> | string | null
    tagKey?: StringNullableWithAggregatesFilter<"MarketSignal"> | string | null
    score?: FloatWithAggregatesFilter<"MarketSignal"> | number
    confidence?: FloatWithAggregatesFilter<"MarketSignal"> | number
    payload?: JsonNullableWithAggregatesFilter<"MarketSignal">
    observedAt?: DateTimeWithAggregatesFilter<"MarketSignal"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"MarketSignal"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"MarketSignal"> | Date | string
  }

  export type ListingQueueWhereInput = {
    AND?: ListingQueueWhereInput | ListingQueueWhereInput[]
    OR?: ListingQueueWhereInput[]
    NOT?: ListingQueueWhereInput | ListingQueueWhereInput[]
    id?: StringFilter<"ListingQueue"> | string
    niche?: StringFilter<"ListingQueue"> | string
    slogan?: StringFilter<"ListingQueue"> | string
    title?: StringFilter<"ListingQueue"> | string
    bullets?: StringNullableListFilter<"ListingQueue">
    tags?: StringNullableListFilter<"ListingQueue">
    mockupPrompt?: StringFilter<"ListingQueue"> | string
    adHooks?: StringNullableListFilter<"ListingQueue">
    visualBatchMetrics?: JsonNullableFilter<"ListingQueue">
    visualStrategyMetrics?: JsonNullableFilter<"ListingQueue">
    visualReleaseGate?: JsonNullableFilter<"ListingQueue">
    status?: StringFilter<"ListingQueue"> | string
    platform?: StringFilter<"ListingQueue"> | string
    priorityScore?: FloatNullableFilter<"ListingQueue"> | number | null
    createdAt?: DateTimeFilter<"ListingQueue"> | Date | string
    updatedAt?: DateTimeFilter<"ListingQueue"> | Date | string
  }

  export type ListingQueueOrderByWithRelationInput = {
    id?: SortOrder
    niche?: SortOrder
    slogan?: SortOrder
    title?: SortOrder
    bullets?: SortOrder
    tags?: SortOrder
    mockupPrompt?: SortOrder
    adHooks?: SortOrder
    visualBatchMetrics?: SortOrderInput | SortOrder
    visualStrategyMetrics?: SortOrderInput | SortOrder
    visualReleaseGate?: SortOrderInput | SortOrder
    status?: SortOrder
    platform?: SortOrder
    priorityScore?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ListingQueueWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ListingQueueWhereInput | ListingQueueWhereInput[]
    OR?: ListingQueueWhereInput[]
    NOT?: ListingQueueWhereInput | ListingQueueWhereInput[]
    niche?: StringFilter<"ListingQueue"> | string
    slogan?: StringFilter<"ListingQueue"> | string
    title?: StringFilter<"ListingQueue"> | string
    bullets?: StringNullableListFilter<"ListingQueue">
    tags?: StringNullableListFilter<"ListingQueue">
    mockupPrompt?: StringFilter<"ListingQueue"> | string
    adHooks?: StringNullableListFilter<"ListingQueue">
    visualBatchMetrics?: JsonNullableFilter<"ListingQueue">
    visualStrategyMetrics?: JsonNullableFilter<"ListingQueue">
    visualReleaseGate?: JsonNullableFilter<"ListingQueue">
    status?: StringFilter<"ListingQueue"> | string
    platform?: StringFilter<"ListingQueue"> | string
    priorityScore?: FloatNullableFilter<"ListingQueue"> | number | null
    createdAt?: DateTimeFilter<"ListingQueue"> | Date | string
    updatedAt?: DateTimeFilter<"ListingQueue"> | Date | string
  }, "id">

  export type ListingQueueOrderByWithAggregationInput = {
    id?: SortOrder
    niche?: SortOrder
    slogan?: SortOrder
    title?: SortOrder
    bullets?: SortOrder
    tags?: SortOrder
    mockupPrompt?: SortOrder
    adHooks?: SortOrder
    visualBatchMetrics?: SortOrderInput | SortOrder
    visualStrategyMetrics?: SortOrderInput | SortOrder
    visualReleaseGate?: SortOrderInput | SortOrder
    status?: SortOrder
    platform?: SortOrder
    priorityScore?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ListingQueueCountOrderByAggregateInput
    _avg?: ListingQueueAvgOrderByAggregateInput
    _max?: ListingQueueMaxOrderByAggregateInput
    _min?: ListingQueueMinOrderByAggregateInput
    _sum?: ListingQueueSumOrderByAggregateInput
  }

  export type ListingQueueScalarWhereWithAggregatesInput = {
    AND?: ListingQueueScalarWhereWithAggregatesInput | ListingQueueScalarWhereWithAggregatesInput[]
    OR?: ListingQueueScalarWhereWithAggregatesInput[]
    NOT?: ListingQueueScalarWhereWithAggregatesInput | ListingQueueScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ListingQueue"> | string
    niche?: StringWithAggregatesFilter<"ListingQueue"> | string
    slogan?: StringWithAggregatesFilter<"ListingQueue"> | string
    title?: StringWithAggregatesFilter<"ListingQueue"> | string
    bullets?: StringNullableListFilter<"ListingQueue">
    tags?: StringNullableListFilter<"ListingQueue">
    mockupPrompt?: StringWithAggregatesFilter<"ListingQueue"> | string
    adHooks?: StringNullableListFilter<"ListingQueue">
    visualBatchMetrics?: JsonNullableWithAggregatesFilter<"ListingQueue">
    visualStrategyMetrics?: JsonNullableWithAggregatesFilter<"ListingQueue">
    visualReleaseGate?: JsonNullableWithAggregatesFilter<"ListingQueue">
    status?: StringWithAggregatesFilter<"ListingQueue"> | string
    platform?: StringWithAggregatesFilter<"ListingQueue"> | string
    priorityScore?: FloatNullableWithAggregatesFilter<"ListingQueue"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"ListingQueue"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ListingQueue"> | Date | string
  }

  export type ListingPerformanceWhereInput = {
    AND?: ListingPerformanceWhereInput | ListingPerformanceWhereInput[]
    OR?: ListingPerformanceWhereInput[]
    NOT?: ListingPerformanceWhereInput | ListingPerformanceWhereInput[]
    id?: StringFilter<"ListingPerformance"> | string
    listingId?: StringFilter<"ListingPerformance"> | string
    impressions?: IntFilter<"ListingPerformance"> | number
    clicks?: IntFilter<"ListingPerformance"> | number
    ctr?: FloatFilter<"ListingPerformance"> | number
    conversions?: IntFilter<"ListingPerformance"> | number
    revenue?: FloatFilter<"ListingPerformance"> | number
    visualBatchMetrics?: JsonNullableFilter<"ListingPerformance">
    visualStrategyMetrics?: JsonNullableFilter<"ListingPerformance">
    visualReleaseGate?: JsonNullableFilter<"ListingPerformance">
    observedAt?: DateTimeFilter<"ListingPerformance"> | Date | string
    createdAt?: DateTimeFilter<"ListingPerformance"> | Date | string
    updatedAt?: DateTimeFilter<"ListingPerformance"> | Date | string
  }

  export type ListingPerformanceOrderByWithRelationInput = {
    id?: SortOrder
    listingId?: SortOrder
    impressions?: SortOrder
    clicks?: SortOrder
    ctr?: SortOrder
    conversions?: SortOrder
    revenue?: SortOrder
    visualBatchMetrics?: SortOrderInput | SortOrder
    visualStrategyMetrics?: SortOrderInput | SortOrder
    visualReleaseGate?: SortOrderInput | SortOrder
    observedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ListingPerformanceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ListingPerformanceWhereInput | ListingPerformanceWhereInput[]
    OR?: ListingPerformanceWhereInput[]
    NOT?: ListingPerformanceWhereInput | ListingPerformanceWhereInput[]
    listingId?: StringFilter<"ListingPerformance"> | string
    impressions?: IntFilter<"ListingPerformance"> | number
    clicks?: IntFilter<"ListingPerformance"> | number
    ctr?: FloatFilter<"ListingPerformance"> | number
    conversions?: IntFilter<"ListingPerformance"> | number
    revenue?: FloatFilter<"ListingPerformance"> | number
    visualBatchMetrics?: JsonNullableFilter<"ListingPerformance">
    visualStrategyMetrics?: JsonNullableFilter<"ListingPerformance">
    visualReleaseGate?: JsonNullableFilter<"ListingPerformance">
    observedAt?: DateTimeFilter<"ListingPerformance"> | Date | string
    createdAt?: DateTimeFilter<"ListingPerformance"> | Date | string
    updatedAt?: DateTimeFilter<"ListingPerformance"> | Date | string
  }, "id">

  export type ListingPerformanceOrderByWithAggregationInput = {
    id?: SortOrder
    listingId?: SortOrder
    impressions?: SortOrder
    clicks?: SortOrder
    ctr?: SortOrder
    conversions?: SortOrder
    revenue?: SortOrder
    visualBatchMetrics?: SortOrderInput | SortOrder
    visualStrategyMetrics?: SortOrderInput | SortOrder
    visualReleaseGate?: SortOrderInput | SortOrder
    observedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ListingPerformanceCountOrderByAggregateInput
    _avg?: ListingPerformanceAvgOrderByAggregateInput
    _max?: ListingPerformanceMaxOrderByAggregateInput
    _min?: ListingPerformanceMinOrderByAggregateInput
    _sum?: ListingPerformanceSumOrderByAggregateInput
  }

  export type ListingPerformanceScalarWhereWithAggregatesInput = {
    AND?: ListingPerformanceScalarWhereWithAggregatesInput | ListingPerformanceScalarWhereWithAggregatesInput[]
    OR?: ListingPerformanceScalarWhereWithAggregatesInput[]
    NOT?: ListingPerformanceScalarWhereWithAggregatesInput | ListingPerformanceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ListingPerformance"> | string
    listingId?: StringWithAggregatesFilter<"ListingPerformance"> | string
    impressions?: IntWithAggregatesFilter<"ListingPerformance"> | number
    clicks?: IntWithAggregatesFilter<"ListingPerformance"> | number
    ctr?: FloatWithAggregatesFilter<"ListingPerformance"> | number
    conversions?: IntWithAggregatesFilter<"ListingPerformance"> | number
    revenue?: FloatWithAggregatesFilter<"ListingPerformance"> | number
    visualBatchMetrics?: JsonNullableWithAggregatesFilter<"ListingPerformance">
    visualStrategyMetrics?: JsonNullableWithAggregatesFilter<"ListingPerformance">
    visualReleaseGate?: JsonNullableWithAggregatesFilter<"ListingPerformance">
    observedAt?: DateTimeWithAggregatesFilter<"ListingPerformance"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"ListingPerformance"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ListingPerformance"> | Date | string
  }

  export type AccountCreateInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
    user: UserCreateNestedOneWithoutAccountsInput
  }

  export type AccountUncheckedCreateInput = {
    id?: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type AccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutAccountsNestedInput
  }

  export type AccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountCreateManyInput = {
    id?: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type AccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionCreateInput = {
    id?: string
    sessionToken: string
    expires: Date | string
    user: UserCreateNestedOneWithoutSessionsInput
  }

  export type SessionUncheckedCreateInput = {
    id?: string
    sessionToken: string
    userId: string
    expires: Date | string
  }

  export type SessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type SessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateManyInput = {
    id?: string
    sessionToken: string
    userId: string
    expires: Date | string
  }

  export type SessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenCreateInput = {
    identifier: string
    token: string
    expires: Date | string
  }

  export type VerificationTokenUncheckedCreateInput = {
    identifier: string
    token: string
    expires: Date | string
  }

  export type VerificationTokenUpdateInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenUncheckedUpdateInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenCreateManyInput = {
    identifier: string
    token: string
    expires: Date | string
  }

  export type VerificationTokenUpdateManyMutationInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenUncheckedUpdateManyInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    password?: string | null
    role?: string
    merchBrand?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionCreateNestedManyWithoutUserInput
    workspaces?: WorkspaceMemberCreateNestedManyWithoutUserInput
    merchOutcomeFeedback?: MerchOutcomeFeedbackCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    password?: string | null
    role?: string
    merchBrand?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutUserInput
    workspaces?: WorkspaceMemberUncheckedCreateNestedManyWithoutUserInput
    merchOutcomeFeedback?: MerchOutcomeFeedbackUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    merchBrand?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionUpdateManyWithoutUserNestedInput
    workspaces?: WorkspaceMemberUpdateManyWithoutUserNestedInput
    merchOutcomeFeedback?: MerchOutcomeFeedbackUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    merchBrand?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutUserNestedInput
    workspaces?: WorkspaceMemberUncheckedUpdateManyWithoutUserNestedInput
    merchOutcomeFeedback?: MerchOutcomeFeedbackUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    password?: string | null
    role?: string
    merchBrand?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    merchBrand?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    merchBrand?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkspaceCreateInput = {
    id?: string
    name: string
    ownerId: string
    createdAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutWorkspaceInput
    members?: WorkspaceMemberCreateNestedManyWithoutWorkspaceInput
  }

  export type WorkspaceUncheckedCreateInput = {
    id?: string
    name: string
    ownerId: string
    createdAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutWorkspaceInput
    members?: WorkspaceMemberUncheckedCreateNestedManyWithoutWorkspaceInput
  }

  export type WorkspaceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutWorkspaceNestedInput
    members?: WorkspaceMemberUpdateManyWithoutWorkspaceNestedInput
  }

  export type WorkspaceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutWorkspaceNestedInput
    members?: WorkspaceMemberUncheckedUpdateManyWithoutWorkspaceNestedInput
  }

  export type WorkspaceCreateManyInput = {
    id?: string
    name: string
    ownerId: string
    createdAt?: Date | string
  }

  export type WorkspaceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkspaceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkspaceMemberCreateInput = {
    id?: string
    role: string
    user: UserCreateNestedOneWithoutWorkspacesInput
    workspace: WorkspaceCreateNestedOneWithoutMembersInput
  }

  export type WorkspaceMemberUncheckedCreateInput = {
    id?: string
    userId: string
    workspaceId: string
    role: string
  }

  export type WorkspaceMemberUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    user?: UserUpdateOneRequiredWithoutWorkspacesNestedInput
    workspace?: WorkspaceUpdateOneRequiredWithoutMembersNestedInput
  }

  export type WorkspaceMemberUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
  }

  export type WorkspaceMemberCreateManyInput = {
    id?: string
    userId: string
    workspaceId: string
    role: string
  }

  export type WorkspaceMemberUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
  }

  export type WorkspaceMemberUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
  }

  export type ProjectCreateInput = {
    id?: string
    name: string
    createdAt?: Date | string
    niches?: NicheCreateNestedManyWithoutProjectInput
    workspace: WorkspaceCreateNestedOneWithoutProjectsInput
  }

  export type ProjectUncheckedCreateInput = {
    id?: string
    name: string
    workspaceId: string
    createdAt?: Date | string
    niches?: NicheUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    niches?: NicheUpdateManyWithoutProjectNestedInput
    workspace?: WorkspaceUpdateOneRequiredWithoutProjectsNestedInput
  }

  export type ProjectUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    niches?: NicheUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectCreateManyInput = {
    id?: string
    name: string
    workspaceId: string
    createdAt?: Date | string
  }

  export type ProjectUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NicheCreateInput = {
    id?: string
    name: string
    score: number
    trendScore: number
    competitionScore: number
    project: ProjectCreateNestedOneWithoutNichesInput
  }

  export type NicheUncheckedCreateInput = {
    id?: string
    name: string
    score: number
    trendScore: number
    competitionScore: number
    projectId: string
  }

  export type NicheUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    trendScore?: FloatFieldUpdateOperationsInput | number
    competitionScore?: FloatFieldUpdateOperationsInput | number
    project?: ProjectUpdateOneRequiredWithoutNichesNestedInput
  }

  export type NicheUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    trendScore?: FloatFieldUpdateOperationsInput | number
    competitionScore?: FloatFieldUpdateOperationsInput | number
    projectId?: StringFieldUpdateOperationsInput | string
  }

  export type NicheCreateManyInput = {
    id?: string
    name: string
    score: number
    trendScore: number
    competitionScore: number
    projectId: string
  }

  export type NicheUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    trendScore?: FloatFieldUpdateOperationsInput | number
    competitionScore?: FloatFieldUpdateOperationsInput | number
  }

  export type NicheUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    trendScore?: FloatFieldUpdateOperationsInput | number
    competitionScore?: FloatFieldUpdateOperationsInput | number
    projectId?: StringFieldUpdateOperationsInput | string
  }

  export type SubscriptionCreateInput = {
    id?: string
    stripeCustomerId?: string | null
    stripeSubId?: string | null
    plan?: string
    status?: string
    currentPeriodEnd?: Date | string | null
    user: UserCreateNestedOneWithoutSubscriptionsInput
  }

  export type SubscriptionUncheckedCreateInput = {
    id?: string
    userId: string
    stripeCustomerId?: string | null
    stripeSubId?: string | null
    plan?: string
    status?: string
    currentPeriodEnd?: Date | string | null
  }

  export type SubscriptionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubId?: NullableStringFieldUpdateOperationsInput | string | null
    plan?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutSubscriptionsNestedInput
  }

  export type SubscriptionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubId?: NullableStringFieldUpdateOperationsInput | string | null
    plan?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SubscriptionCreateManyInput = {
    id?: string
    userId: string
    stripeCustomerId?: string | null
    stripeSubId?: string | null
    plan?: string
    status?: string
    currentPeriodEnd?: Date | string | null
  }

  export type SubscriptionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubId?: NullableStringFieldUpdateOperationsInput | string | null
    plan?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SubscriptionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubId?: NullableStringFieldUpdateOperationsInput | string | null
    plan?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UsageMetricCreateInput = {
    id?: string
    userId: string
    type: string
    value: number
    createdAt?: Date | string
  }

  export type UsageMetricUncheckedCreateInput = {
    id?: string
    userId: string
    type: string
    value: number
    createdAt?: Date | string
  }

  export type UsageMetricUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    value?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsageMetricUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    value?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsageMetricCreateManyInput = {
    id?: string
    userId: string
    type: string
    value: number
    createdAt?: Date | string
  }

  export type UsageMetricUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    value?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsageMetricUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    value?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AutopilotJobCreateInput = {
    id?: string
    status?: string
    workspaceId: string
    createdAt?: Date | string
  }

  export type AutopilotJobUncheckedCreateInput = {
    id?: string
    status?: string
    workspaceId: string
    createdAt?: Date | string
  }

  export type AutopilotJobUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AutopilotJobUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AutopilotJobCreateManyInput = {
    id?: string
    status?: string
    workspaceId: string
    createdAt?: Date | string
  }

  export type AutopilotJobUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AutopilotJobUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SignalSnapshotCreateInput = {
    id?: string
    source: string
    snapshotKey: string
    data: JsonNullValueInput | InputJsonValue
    fetchedAt: Date | string
    expiresAt: Date | string
    confidence: number
    status?: string
    transport?: string
    details?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SignalSnapshotUncheckedCreateInput = {
    id?: string
    source: string
    snapshotKey: string
    data: JsonNullValueInput | InputJsonValue
    fetchedAt: Date | string
    expiresAt: Date | string
    confidence: number
    status?: string
    transport?: string
    details?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SignalSnapshotUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    snapshotKey?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    fetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confidence?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    transport?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SignalSnapshotUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    snapshotKey?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    fetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confidence?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    transport?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SignalSnapshotCreateManyInput = {
    id?: string
    source: string
    snapshotKey: string
    data: JsonNullValueInput | InputJsonValue
    fetchedAt: Date | string
    expiresAt: Date | string
    confidence: number
    status?: string
    transport?: string
    details?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SignalSnapshotUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    snapshotKey?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    fetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confidence?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    transport?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SignalSnapshotUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    snapshotKey?: StringFieldUpdateOperationsInput | string
    data?: JsonNullValueInput | InputJsonValue
    fetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confidence?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    transport?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SignalSourceHealthCreateInput = {
    id?: string
    source: string
    status?: string
    failureCount?: number
    lastSuccess?: Date | string | null
    lastFailure?: Date | string | null
    cooldownUntil?: Date | string | null
    lastError?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SignalSourceHealthUncheckedCreateInput = {
    id?: string
    source: string
    status?: string
    failureCount?: number
    lastSuccess?: Date | string | null
    lastFailure?: Date | string | null
    cooldownUntil?: Date | string | null
    lastError?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SignalSourceHealthUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    failureCount?: IntFieldUpdateOperationsInput | number
    lastSuccess?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastFailure?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cooldownUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SignalSourceHealthUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    failureCount?: IntFieldUpdateOperationsInput | number
    lastSuccess?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastFailure?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cooldownUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SignalSourceHealthCreateManyInput = {
    id?: string
    source: string
    status?: string
    failureCount?: number
    lastSuccess?: Date | string | null
    lastFailure?: Date | string | null
    cooldownUntil?: Date | string | null
    lastError?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SignalSourceHealthUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    failureCount?: IntFieldUpdateOperationsInput | number
    lastSuccess?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastFailure?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cooldownUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SignalSourceHealthUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    failureCount?: IntFieldUpdateOperationsInput | number
    lastSuccess?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastFailure?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cooldownUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MerchOutcomeFeedbackCreateInput = {
    id?: string
    niche: string
    nicheKey: string
    platform: string
    slogan: string
    sloganKey: string
    pattern?: string | null
    tags?: MerchOutcomeFeedbackCreatetagsInput | string[]
    audience?: string | null
    style?: string | null
    productTitle?: string | null
    visualBatchMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualStrategyMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualReleaseGate?: NullableJsonNullValueInput | InputJsonValue
    impressions?: number
    clicks?: number
    orders?: number
    favorites?: number
    revenue?: number
    refunds?: number
    observedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutMerchOutcomeFeedbackInput
  }

  export type MerchOutcomeFeedbackUncheckedCreateInput = {
    id?: string
    userId: string
    niche: string
    nicheKey: string
    platform: string
    slogan: string
    sloganKey: string
    pattern?: string | null
    tags?: MerchOutcomeFeedbackCreatetagsInput | string[]
    audience?: string | null
    style?: string | null
    productTitle?: string | null
    visualBatchMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualStrategyMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualReleaseGate?: NullableJsonNullValueInput | InputJsonValue
    impressions?: number
    clicks?: number
    orders?: number
    favorites?: number
    revenue?: number
    refunds?: number
    observedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MerchOutcomeFeedbackUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    niche?: StringFieldUpdateOperationsInput | string
    nicheKey?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    slogan?: StringFieldUpdateOperationsInput | string
    sloganKey?: StringFieldUpdateOperationsInput | string
    pattern?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: MerchOutcomeFeedbackUpdatetagsInput | string[]
    audience?: NullableStringFieldUpdateOperationsInput | string | null
    style?: NullableStringFieldUpdateOperationsInput | string | null
    productTitle?: NullableStringFieldUpdateOperationsInput | string | null
    visualBatchMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualStrategyMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualReleaseGate?: NullableJsonNullValueInput | InputJsonValue
    impressions?: IntFieldUpdateOperationsInput | number
    clicks?: IntFieldUpdateOperationsInput | number
    orders?: IntFieldUpdateOperationsInput | number
    favorites?: IntFieldUpdateOperationsInput | number
    revenue?: FloatFieldUpdateOperationsInput | number
    refunds?: IntFieldUpdateOperationsInput | number
    observedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutMerchOutcomeFeedbackNestedInput
  }

  export type MerchOutcomeFeedbackUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    niche?: StringFieldUpdateOperationsInput | string
    nicheKey?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    slogan?: StringFieldUpdateOperationsInput | string
    sloganKey?: StringFieldUpdateOperationsInput | string
    pattern?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: MerchOutcomeFeedbackUpdatetagsInput | string[]
    audience?: NullableStringFieldUpdateOperationsInput | string | null
    style?: NullableStringFieldUpdateOperationsInput | string | null
    productTitle?: NullableStringFieldUpdateOperationsInput | string | null
    visualBatchMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualStrategyMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualReleaseGate?: NullableJsonNullValueInput | InputJsonValue
    impressions?: IntFieldUpdateOperationsInput | number
    clicks?: IntFieldUpdateOperationsInput | number
    orders?: IntFieldUpdateOperationsInput | number
    favorites?: IntFieldUpdateOperationsInput | number
    revenue?: FloatFieldUpdateOperationsInput | number
    refunds?: IntFieldUpdateOperationsInput | number
    observedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MerchOutcomeFeedbackCreateManyInput = {
    id?: string
    userId: string
    niche: string
    nicheKey: string
    platform: string
    slogan: string
    sloganKey: string
    pattern?: string | null
    tags?: MerchOutcomeFeedbackCreatetagsInput | string[]
    audience?: string | null
    style?: string | null
    productTitle?: string | null
    visualBatchMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualStrategyMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualReleaseGate?: NullableJsonNullValueInput | InputJsonValue
    impressions?: number
    clicks?: number
    orders?: number
    favorites?: number
    revenue?: number
    refunds?: number
    observedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MerchOutcomeFeedbackUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    niche?: StringFieldUpdateOperationsInput | string
    nicheKey?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    slogan?: StringFieldUpdateOperationsInput | string
    sloganKey?: StringFieldUpdateOperationsInput | string
    pattern?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: MerchOutcomeFeedbackUpdatetagsInput | string[]
    audience?: NullableStringFieldUpdateOperationsInput | string | null
    style?: NullableStringFieldUpdateOperationsInput | string | null
    productTitle?: NullableStringFieldUpdateOperationsInput | string | null
    visualBatchMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualStrategyMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualReleaseGate?: NullableJsonNullValueInput | InputJsonValue
    impressions?: IntFieldUpdateOperationsInput | number
    clicks?: IntFieldUpdateOperationsInput | number
    orders?: IntFieldUpdateOperationsInput | number
    favorites?: IntFieldUpdateOperationsInput | number
    revenue?: FloatFieldUpdateOperationsInput | number
    refunds?: IntFieldUpdateOperationsInput | number
    observedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MerchOutcomeFeedbackUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    niche?: StringFieldUpdateOperationsInput | string
    nicheKey?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    slogan?: StringFieldUpdateOperationsInput | string
    sloganKey?: StringFieldUpdateOperationsInput | string
    pattern?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: MerchOutcomeFeedbackUpdatetagsInput | string[]
    audience?: NullableStringFieldUpdateOperationsInput | string | null
    style?: NullableStringFieldUpdateOperationsInput | string | null
    productTitle?: NullableStringFieldUpdateOperationsInput | string | null
    visualBatchMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualStrategyMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualReleaseGate?: NullableJsonNullValueInput | InputJsonValue
    impressions?: IntFieldUpdateOperationsInput | number
    clicks?: IntFieldUpdateOperationsInput | number
    orders?: IntFieldUpdateOperationsInput | number
    favorites?: IntFieldUpdateOperationsInput | number
    revenue?: FloatFieldUpdateOperationsInput | number
    refunds?: IntFieldUpdateOperationsInput | number
    observedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SloganPatternCreateInput = {
    id?: string
    niche: string
    pattern: string
    score?: number
    uses?: number
    impressions?: number
    clicks?: number
    sales?: number
    ctr?: number
    conversion?: number
    lastSlogan?: string | null
    nicheHints?: SloganPatternCreatenicheHintsInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SloganPatternUncheckedCreateInput = {
    id?: string
    niche: string
    pattern: string
    score?: number
    uses?: number
    impressions?: number
    clicks?: number
    sales?: number
    ctr?: number
    conversion?: number
    lastSlogan?: string | null
    nicheHints?: SloganPatternCreatenicheHintsInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SloganPatternUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    niche?: StringFieldUpdateOperationsInput | string
    pattern?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    uses?: IntFieldUpdateOperationsInput | number
    impressions?: IntFieldUpdateOperationsInput | number
    clicks?: IntFieldUpdateOperationsInput | number
    sales?: IntFieldUpdateOperationsInput | number
    ctr?: FloatFieldUpdateOperationsInput | number
    conversion?: FloatFieldUpdateOperationsInput | number
    lastSlogan?: NullableStringFieldUpdateOperationsInput | string | null
    nicheHints?: SloganPatternUpdatenicheHintsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SloganPatternUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    niche?: StringFieldUpdateOperationsInput | string
    pattern?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    uses?: IntFieldUpdateOperationsInput | number
    impressions?: IntFieldUpdateOperationsInput | number
    clicks?: IntFieldUpdateOperationsInput | number
    sales?: IntFieldUpdateOperationsInput | number
    ctr?: FloatFieldUpdateOperationsInput | number
    conversion?: FloatFieldUpdateOperationsInput | number
    lastSlogan?: NullableStringFieldUpdateOperationsInput | string | null
    nicheHints?: SloganPatternUpdatenicheHintsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SloganPatternCreateManyInput = {
    id?: string
    niche: string
    pattern: string
    score?: number
    uses?: number
    impressions?: number
    clicks?: number
    sales?: number
    ctr?: number
    conversion?: number
    lastSlogan?: string | null
    nicheHints?: SloganPatternCreatenicheHintsInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SloganPatternUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    niche?: StringFieldUpdateOperationsInput | string
    pattern?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    uses?: IntFieldUpdateOperationsInput | number
    impressions?: IntFieldUpdateOperationsInput | number
    clicks?: IntFieldUpdateOperationsInput | number
    sales?: IntFieldUpdateOperationsInput | number
    ctr?: FloatFieldUpdateOperationsInput | number
    conversion?: FloatFieldUpdateOperationsInput | number
    lastSlogan?: NullableStringFieldUpdateOperationsInput | string | null
    nicheHints?: SloganPatternUpdatenicheHintsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SloganPatternUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    niche?: StringFieldUpdateOperationsInput | string
    pattern?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    uses?: IntFieldUpdateOperationsInput | number
    impressions?: IntFieldUpdateOperationsInput | number
    clicks?: IntFieldUpdateOperationsInput | number
    sales?: IntFieldUpdateOperationsInput | number
    ctr?: FloatFieldUpdateOperationsInput | number
    conversion?: FloatFieldUpdateOperationsInput | number
    lastSlogan?: NullableStringFieldUpdateOperationsInput | string | null
    nicheHints?: SloganPatternUpdatenicheHintsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MarketSignalCreateInput = {
    id?: string
    niche: string
    text: string
    source: string
    nicheKey?: string | null
    sloganKey?: string | null
    tagKey?: string | null
    score?: number
    confidence?: number
    payload?: NullableJsonNullValueInput | InputJsonValue
    observedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MarketSignalUncheckedCreateInput = {
    id?: string
    niche: string
    text: string
    source: string
    nicheKey?: string | null
    sloganKey?: string | null
    tagKey?: string | null
    score?: number
    confidence?: number
    payload?: NullableJsonNullValueInput | InputJsonValue
    observedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MarketSignalUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    niche?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    nicheKey?: NullableStringFieldUpdateOperationsInput | string | null
    sloganKey?: NullableStringFieldUpdateOperationsInput | string | null
    tagKey?: NullableStringFieldUpdateOperationsInput | string | null
    score?: FloatFieldUpdateOperationsInput | number
    confidence?: FloatFieldUpdateOperationsInput | number
    payload?: NullableJsonNullValueInput | InputJsonValue
    observedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MarketSignalUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    niche?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    nicheKey?: NullableStringFieldUpdateOperationsInput | string | null
    sloganKey?: NullableStringFieldUpdateOperationsInput | string | null
    tagKey?: NullableStringFieldUpdateOperationsInput | string | null
    score?: FloatFieldUpdateOperationsInput | number
    confidence?: FloatFieldUpdateOperationsInput | number
    payload?: NullableJsonNullValueInput | InputJsonValue
    observedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MarketSignalCreateManyInput = {
    id?: string
    niche: string
    text: string
    source: string
    nicheKey?: string | null
    sloganKey?: string | null
    tagKey?: string | null
    score?: number
    confidence?: number
    payload?: NullableJsonNullValueInput | InputJsonValue
    observedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MarketSignalUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    niche?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    nicheKey?: NullableStringFieldUpdateOperationsInput | string | null
    sloganKey?: NullableStringFieldUpdateOperationsInput | string | null
    tagKey?: NullableStringFieldUpdateOperationsInput | string | null
    score?: FloatFieldUpdateOperationsInput | number
    confidence?: FloatFieldUpdateOperationsInput | number
    payload?: NullableJsonNullValueInput | InputJsonValue
    observedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MarketSignalUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    niche?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    nicheKey?: NullableStringFieldUpdateOperationsInput | string | null
    sloganKey?: NullableStringFieldUpdateOperationsInput | string | null
    tagKey?: NullableStringFieldUpdateOperationsInput | string | null
    score?: FloatFieldUpdateOperationsInput | number
    confidence?: FloatFieldUpdateOperationsInput | number
    payload?: NullableJsonNullValueInput | InputJsonValue
    observedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ListingQueueCreateInput = {
    id?: string
    niche: string
    slogan: string
    title: string
    bullets?: ListingQueueCreatebulletsInput | string[]
    tags?: ListingQueueCreatetagsInput | string[]
    mockupPrompt: string
    adHooks?: ListingQueueCreateadHooksInput | string[]
    visualBatchMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualStrategyMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualReleaseGate?: NullableJsonNullValueInput | InputJsonValue
    status?: string
    platform?: string
    priorityScore?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ListingQueueUncheckedCreateInput = {
    id?: string
    niche: string
    slogan: string
    title: string
    bullets?: ListingQueueCreatebulletsInput | string[]
    tags?: ListingQueueCreatetagsInput | string[]
    mockupPrompt: string
    adHooks?: ListingQueueCreateadHooksInput | string[]
    visualBatchMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualStrategyMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualReleaseGate?: NullableJsonNullValueInput | InputJsonValue
    status?: string
    platform?: string
    priorityScore?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ListingQueueUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    niche?: StringFieldUpdateOperationsInput | string
    slogan?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    bullets?: ListingQueueUpdatebulletsInput | string[]
    tags?: ListingQueueUpdatetagsInput | string[]
    mockupPrompt?: StringFieldUpdateOperationsInput | string
    adHooks?: ListingQueueUpdateadHooksInput | string[]
    visualBatchMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualStrategyMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualReleaseGate?: NullableJsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    priorityScore?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ListingQueueUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    niche?: StringFieldUpdateOperationsInput | string
    slogan?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    bullets?: ListingQueueUpdatebulletsInput | string[]
    tags?: ListingQueueUpdatetagsInput | string[]
    mockupPrompt?: StringFieldUpdateOperationsInput | string
    adHooks?: ListingQueueUpdateadHooksInput | string[]
    visualBatchMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualStrategyMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualReleaseGate?: NullableJsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    priorityScore?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ListingQueueCreateManyInput = {
    id?: string
    niche: string
    slogan: string
    title: string
    bullets?: ListingQueueCreatebulletsInput | string[]
    tags?: ListingQueueCreatetagsInput | string[]
    mockupPrompt: string
    adHooks?: ListingQueueCreateadHooksInput | string[]
    visualBatchMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualStrategyMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualReleaseGate?: NullableJsonNullValueInput | InputJsonValue
    status?: string
    platform?: string
    priorityScore?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ListingQueueUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    niche?: StringFieldUpdateOperationsInput | string
    slogan?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    bullets?: ListingQueueUpdatebulletsInput | string[]
    tags?: ListingQueueUpdatetagsInput | string[]
    mockupPrompt?: StringFieldUpdateOperationsInput | string
    adHooks?: ListingQueueUpdateadHooksInput | string[]
    visualBatchMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualStrategyMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualReleaseGate?: NullableJsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    priorityScore?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ListingQueueUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    niche?: StringFieldUpdateOperationsInput | string
    slogan?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    bullets?: ListingQueueUpdatebulletsInput | string[]
    tags?: ListingQueueUpdatetagsInput | string[]
    mockupPrompt?: StringFieldUpdateOperationsInput | string
    adHooks?: ListingQueueUpdateadHooksInput | string[]
    visualBatchMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualStrategyMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualReleaseGate?: NullableJsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    priorityScore?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ListingPerformanceCreateInput = {
    id?: string
    listingId: string
    impressions?: number
    clicks?: number
    ctr?: number
    conversions?: number
    revenue?: number
    visualBatchMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualStrategyMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualReleaseGate?: NullableJsonNullValueInput | InputJsonValue
    observedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ListingPerformanceUncheckedCreateInput = {
    id?: string
    listingId: string
    impressions?: number
    clicks?: number
    ctr?: number
    conversions?: number
    revenue?: number
    visualBatchMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualStrategyMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualReleaseGate?: NullableJsonNullValueInput | InputJsonValue
    observedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ListingPerformanceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    listingId?: StringFieldUpdateOperationsInput | string
    impressions?: IntFieldUpdateOperationsInput | number
    clicks?: IntFieldUpdateOperationsInput | number
    ctr?: FloatFieldUpdateOperationsInput | number
    conversions?: IntFieldUpdateOperationsInput | number
    revenue?: FloatFieldUpdateOperationsInput | number
    visualBatchMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualStrategyMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualReleaseGate?: NullableJsonNullValueInput | InputJsonValue
    observedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ListingPerformanceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    listingId?: StringFieldUpdateOperationsInput | string
    impressions?: IntFieldUpdateOperationsInput | number
    clicks?: IntFieldUpdateOperationsInput | number
    ctr?: FloatFieldUpdateOperationsInput | number
    conversions?: IntFieldUpdateOperationsInput | number
    revenue?: FloatFieldUpdateOperationsInput | number
    visualBatchMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualStrategyMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualReleaseGate?: NullableJsonNullValueInput | InputJsonValue
    observedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ListingPerformanceCreateManyInput = {
    id?: string
    listingId: string
    impressions?: number
    clicks?: number
    ctr?: number
    conversions?: number
    revenue?: number
    visualBatchMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualStrategyMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualReleaseGate?: NullableJsonNullValueInput | InputJsonValue
    observedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ListingPerformanceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    listingId?: StringFieldUpdateOperationsInput | string
    impressions?: IntFieldUpdateOperationsInput | number
    clicks?: IntFieldUpdateOperationsInput | number
    ctr?: FloatFieldUpdateOperationsInput | number
    conversions?: IntFieldUpdateOperationsInput | number
    revenue?: FloatFieldUpdateOperationsInput | number
    visualBatchMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualStrategyMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualReleaseGate?: NullableJsonNullValueInput | InputJsonValue
    observedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ListingPerformanceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    listingId?: StringFieldUpdateOperationsInput | string
    impressions?: IntFieldUpdateOperationsInput | number
    clicks?: IntFieldUpdateOperationsInput | number
    ctr?: FloatFieldUpdateOperationsInput | number
    conversions?: IntFieldUpdateOperationsInput | number
    revenue?: FloatFieldUpdateOperationsInput | number
    visualBatchMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualStrategyMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualReleaseGate?: NullableJsonNullValueInput | InputJsonValue
    observedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AccountProviderProviderAccountIdCompoundUniqueInput = {
    provider: string
    providerAccountId: string
  }

  export type AccountCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
  }

  export type AccountAvgOrderByAggregateInput = {
    expires_at?: SortOrder
  }

  export type AccountMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
  }

  export type AccountMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
  }

  export type AccountSumOrderByAggregateInput = {
    expires_at?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type VerificationTokenIdentifierTokenCompoundUniqueInput = {
    identifier: string
    token: string
  }

  export type VerificationTokenCountOrderByAggregateInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type VerificationTokenMaxOrderByAggregateInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type VerificationTokenMinOrderByAggregateInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type AccountListRelationFilter = {
    every?: AccountWhereInput
    some?: AccountWhereInput
    none?: AccountWhereInput
  }

  export type SessionListRelationFilter = {
    every?: SessionWhereInput
    some?: SessionWhereInput
    none?: SessionWhereInput
  }

  export type SubscriptionListRelationFilter = {
    every?: SubscriptionWhereInput
    some?: SubscriptionWhereInput
    none?: SubscriptionWhereInput
  }

  export type WorkspaceMemberListRelationFilter = {
    every?: WorkspaceMemberWhereInput
    some?: WorkspaceMemberWhereInput
    none?: WorkspaceMemberWhereInput
  }

  export type MerchOutcomeFeedbackListRelationFilter = {
    every?: MerchOutcomeFeedbackWhereInput
    some?: MerchOutcomeFeedbackWhereInput
    none?: MerchOutcomeFeedbackWhereInput
  }

  export type AccountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SubscriptionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WorkspaceMemberOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MerchOutcomeFeedbackOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    password?: SortOrder
    role?: SortOrder
    merchBrand?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    password?: SortOrder
    role?: SortOrder
    merchBrand?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    password?: SortOrder
    role?: SortOrder
    merchBrand?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type ProjectListRelationFilter = {
    every?: ProjectWhereInput
    some?: ProjectWhereInput
    none?: ProjectWhereInput
  }

  export type ProjectOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WorkspaceCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
  }

  export type WorkspaceMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
  }

  export type WorkspaceMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
  }

  export type WorkspaceRelationFilter = {
    is?: WorkspaceWhereInput
    isNot?: WorkspaceWhereInput
  }

  export type WorkspaceMemberCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    workspaceId?: SortOrder
    role?: SortOrder
  }

  export type WorkspaceMemberMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    workspaceId?: SortOrder
    role?: SortOrder
  }

  export type WorkspaceMemberMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    workspaceId?: SortOrder
    role?: SortOrder
  }

  export type NicheListRelationFilter = {
    every?: NicheWhereInput
    some?: NicheWhereInput
    none?: NicheWhereInput
  }

  export type NicheOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProjectCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    workspaceId?: SortOrder
    createdAt?: SortOrder
  }

  export type ProjectMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    workspaceId?: SortOrder
    createdAt?: SortOrder
  }

  export type ProjectMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    workspaceId?: SortOrder
    createdAt?: SortOrder
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type ProjectRelationFilter = {
    is?: ProjectWhereInput
    isNot?: ProjectWhereInput
  }

  export type NicheCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    score?: SortOrder
    trendScore?: SortOrder
    competitionScore?: SortOrder
    projectId?: SortOrder
  }

  export type NicheAvgOrderByAggregateInput = {
    score?: SortOrder
    trendScore?: SortOrder
    competitionScore?: SortOrder
  }

  export type NicheMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    score?: SortOrder
    trendScore?: SortOrder
    competitionScore?: SortOrder
    projectId?: SortOrder
  }

  export type NicheMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    score?: SortOrder
    trendScore?: SortOrder
    competitionScore?: SortOrder
    projectId?: SortOrder
  }

  export type NicheSumOrderByAggregateInput = {
    score?: SortOrder
    trendScore?: SortOrder
    competitionScore?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type SubscriptionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    stripeCustomerId?: SortOrder
    stripeSubId?: SortOrder
    plan?: SortOrder
    status?: SortOrder
    currentPeriodEnd?: SortOrder
  }

  export type SubscriptionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    stripeCustomerId?: SortOrder
    stripeSubId?: SortOrder
    plan?: SortOrder
    status?: SortOrder
    currentPeriodEnd?: SortOrder
  }

  export type SubscriptionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    stripeCustomerId?: SortOrder
    stripeSubId?: SortOrder
    plan?: SortOrder
    status?: SortOrder
    currentPeriodEnd?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type UsageMetricCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
  }

  export type UsageMetricAvgOrderByAggregateInput = {
    value?: SortOrder
  }

  export type UsageMetricMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
  }

  export type UsageMetricMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
  }

  export type UsageMetricSumOrderByAggregateInput = {
    value?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type AutopilotJobCountOrderByAggregateInput = {
    id?: SortOrder
    status?: SortOrder
    workspaceId?: SortOrder
    createdAt?: SortOrder
  }

  export type AutopilotJobMaxOrderByAggregateInput = {
    id?: SortOrder
    status?: SortOrder
    workspaceId?: SortOrder
    createdAt?: SortOrder
  }

  export type AutopilotJobMinOrderByAggregateInput = {
    id?: SortOrder
    status?: SortOrder
    workspaceId?: SortOrder
    createdAt?: SortOrder
  }
  export type JsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type SignalSnapshotSourceSnapshotKeyCompoundUniqueInput = {
    source: string
    snapshotKey: string
  }

  export type SignalSnapshotCountOrderByAggregateInput = {
    id?: SortOrder
    source?: SortOrder
    snapshotKey?: SortOrder
    data?: SortOrder
    fetchedAt?: SortOrder
    expiresAt?: SortOrder
    confidence?: SortOrder
    status?: SortOrder
    transport?: SortOrder
    details?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SignalSnapshotAvgOrderByAggregateInput = {
    confidence?: SortOrder
  }

  export type SignalSnapshotMaxOrderByAggregateInput = {
    id?: SortOrder
    source?: SortOrder
    snapshotKey?: SortOrder
    fetchedAt?: SortOrder
    expiresAt?: SortOrder
    confidence?: SortOrder
    status?: SortOrder
    transport?: SortOrder
    details?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SignalSnapshotMinOrderByAggregateInput = {
    id?: SortOrder
    source?: SortOrder
    snapshotKey?: SortOrder
    fetchedAt?: SortOrder
    expiresAt?: SortOrder
    confidence?: SortOrder
    status?: SortOrder
    transport?: SortOrder
    details?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SignalSnapshotSumOrderByAggregateInput = {
    confidence?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type SignalSourceHealthCountOrderByAggregateInput = {
    id?: SortOrder
    source?: SortOrder
    status?: SortOrder
    failureCount?: SortOrder
    lastSuccess?: SortOrder
    lastFailure?: SortOrder
    cooldownUntil?: SortOrder
    lastError?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SignalSourceHealthAvgOrderByAggregateInput = {
    failureCount?: SortOrder
  }

  export type SignalSourceHealthMaxOrderByAggregateInput = {
    id?: SortOrder
    source?: SortOrder
    status?: SortOrder
    failureCount?: SortOrder
    lastSuccess?: SortOrder
    lastFailure?: SortOrder
    cooldownUntil?: SortOrder
    lastError?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SignalSourceHealthMinOrderByAggregateInput = {
    id?: SortOrder
    source?: SortOrder
    status?: SortOrder
    failureCount?: SortOrder
    lastSuccess?: SortOrder
    lastFailure?: SortOrder
    cooldownUntil?: SortOrder
    lastError?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SignalSourceHealthSumOrderByAggregateInput = {
    failureCount?: SortOrder
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }
  export type JsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type MerchOutcomeFeedbackCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    niche?: SortOrder
    nicheKey?: SortOrder
    platform?: SortOrder
    slogan?: SortOrder
    sloganKey?: SortOrder
    pattern?: SortOrder
    tags?: SortOrder
    audience?: SortOrder
    style?: SortOrder
    productTitle?: SortOrder
    visualBatchMetrics?: SortOrder
    visualStrategyMetrics?: SortOrder
    visualReleaseGate?: SortOrder
    impressions?: SortOrder
    clicks?: SortOrder
    orders?: SortOrder
    favorites?: SortOrder
    revenue?: SortOrder
    refunds?: SortOrder
    observedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MerchOutcomeFeedbackAvgOrderByAggregateInput = {
    impressions?: SortOrder
    clicks?: SortOrder
    orders?: SortOrder
    favorites?: SortOrder
    revenue?: SortOrder
    refunds?: SortOrder
  }

  export type MerchOutcomeFeedbackMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    niche?: SortOrder
    nicheKey?: SortOrder
    platform?: SortOrder
    slogan?: SortOrder
    sloganKey?: SortOrder
    pattern?: SortOrder
    audience?: SortOrder
    style?: SortOrder
    productTitle?: SortOrder
    impressions?: SortOrder
    clicks?: SortOrder
    orders?: SortOrder
    favorites?: SortOrder
    revenue?: SortOrder
    refunds?: SortOrder
    observedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MerchOutcomeFeedbackMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    niche?: SortOrder
    nicheKey?: SortOrder
    platform?: SortOrder
    slogan?: SortOrder
    sloganKey?: SortOrder
    pattern?: SortOrder
    audience?: SortOrder
    style?: SortOrder
    productTitle?: SortOrder
    impressions?: SortOrder
    clicks?: SortOrder
    orders?: SortOrder
    favorites?: SortOrder
    revenue?: SortOrder
    refunds?: SortOrder
    observedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MerchOutcomeFeedbackSumOrderByAggregateInput = {
    impressions?: SortOrder
    clicks?: SortOrder
    orders?: SortOrder
    favorites?: SortOrder
    revenue?: SortOrder
    refunds?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type SloganPatternNichePatternCompoundUniqueInput = {
    niche: string
    pattern: string
  }

  export type SloganPatternCountOrderByAggregateInput = {
    id?: SortOrder
    niche?: SortOrder
    pattern?: SortOrder
    score?: SortOrder
    uses?: SortOrder
    impressions?: SortOrder
    clicks?: SortOrder
    sales?: SortOrder
    ctr?: SortOrder
    conversion?: SortOrder
    lastSlogan?: SortOrder
    nicheHints?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SloganPatternAvgOrderByAggregateInput = {
    score?: SortOrder
    uses?: SortOrder
    impressions?: SortOrder
    clicks?: SortOrder
    sales?: SortOrder
    ctr?: SortOrder
    conversion?: SortOrder
  }

  export type SloganPatternMaxOrderByAggregateInput = {
    id?: SortOrder
    niche?: SortOrder
    pattern?: SortOrder
    score?: SortOrder
    uses?: SortOrder
    impressions?: SortOrder
    clicks?: SortOrder
    sales?: SortOrder
    ctr?: SortOrder
    conversion?: SortOrder
    lastSlogan?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SloganPatternMinOrderByAggregateInput = {
    id?: SortOrder
    niche?: SortOrder
    pattern?: SortOrder
    score?: SortOrder
    uses?: SortOrder
    impressions?: SortOrder
    clicks?: SortOrder
    sales?: SortOrder
    ctr?: SortOrder
    conversion?: SortOrder
    lastSlogan?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SloganPatternSumOrderByAggregateInput = {
    score?: SortOrder
    uses?: SortOrder
    impressions?: SortOrder
    clicks?: SortOrder
    sales?: SortOrder
    ctr?: SortOrder
    conversion?: SortOrder
  }

  export type MarketSignalCountOrderByAggregateInput = {
    id?: SortOrder
    niche?: SortOrder
    text?: SortOrder
    source?: SortOrder
    nicheKey?: SortOrder
    sloganKey?: SortOrder
    tagKey?: SortOrder
    score?: SortOrder
    confidence?: SortOrder
    payload?: SortOrder
    observedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MarketSignalAvgOrderByAggregateInput = {
    score?: SortOrder
    confidence?: SortOrder
  }

  export type MarketSignalMaxOrderByAggregateInput = {
    id?: SortOrder
    niche?: SortOrder
    text?: SortOrder
    source?: SortOrder
    nicheKey?: SortOrder
    sloganKey?: SortOrder
    tagKey?: SortOrder
    score?: SortOrder
    confidence?: SortOrder
    observedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MarketSignalMinOrderByAggregateInput = {
    id?: SortOrder
    niche?: SortOrder
    text?: SortOrder
    source?: SortOrder
    nicheKey?: SortOrder
    sloganKey?: SortOrder
    tagKey?: SortOrder
    score?: SortOrder
    confidence?: SortOrder
    observedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MarketSignalSumOrderByAggregateInput = {
    score?: SortOrder
    confidence?: SortOrder
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type ListingQueueCountOrderByAggregateInput = {
    id?: SortOrder
    niche?: SortOrder
    slogan?: SortOrder
    title?: SortOrder
    bullets?: SortOrder
    tags?: SortOrder
    mockupPrompt?: SortOrder
    adHooks?: SortOrder
    visualBatchMetrics?: SortOrder
    visualStrategyMetrics?: SortOrder
    visualReleaseGate?: SortOrder
    status?: SortOrder
    platform?: SortOrder
    priorityScore?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ListingQueueAvgOrderByAggregateInput = {
    priorityScore?: SortOrder
  }

  export type ListingQueueMaxOrderByAggregateInput = {
    id?: SortOrder
    niche?: SortOrder
    slogan?: SortOrder
    title?: SortOrder
    mockupPrompt?: SortOrder
    status?: SortOrder
    platform?: SortOrder
    priorityScore?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ListingQueueMinOrderByAggregateInput = {
    id?: SortOrder
    niche?: SortOrder
    slogan?: SortOrder
    title?: SortOrder
    mockupPrompt?: SortOrder
    status?: SortOrder
    platform?: SortOrder
    priorityScore?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ListingQueueSumOrderByAggregateInput = {
    priorityScore?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type ListingPerformanceCountOrderByAggregateInput = {
    id?: SortOrder
    listingId?: SortOrder
    impressions?: SortOrder
    clicks?: SortOrder
    ctr?: SortOrder
    conversions?: SortOrder
    revenue?: SortOrder
    visualBatchMetrics?: SortOrder
    visualStrategyMetrics?: SortOrder
    visualReleaseGate?: SortOrder
    observedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ListingPerformanceAvgOrderByAggregateInput = {
    impressions?: SortOrder
    clicks?: SortOrder
    ctr?: SortOrder
    conversions?: SortOrder
    revenue?: SortOrder
  }

  export type ListingPerformanceMaxOrderByAggregateInput = {
    id?: SortOrder
    listingId?: SortOrder
    impressions?: SortOrder
    clicks?: SortOrder
    ctr?: SortOrder
    conversions?: SortOrder
    revenue?: SortOrder
    observedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ListingPerformanceMinOrderByAggregateInput = {
    id?: SortOrder
    listingId?: SortOrder
    impressions?: SortOrder
    clicks?: SortOrder
    ctr?: SortOrder
    conversions?: SortOrder
    revenue?: SortOrder
    observedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ListingPerformanceSumOrderByAggregateInput = {
    impressions?: SortOrder
    clicks?: SortOrder
    ctr?: SortOrder
    conversions?: SortOrder
    revenue?: SortOrder
  }

  export type UserCreateNestedOneWithoutAccountsInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    connect?: UserWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutAccountsNestedInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    upsert?: UserUpsertWithoutAccountsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAccountsInput, UserUpdateWithoutAccountsInput>, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type AccountCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type SessionCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type SubscriptionCreateNestedManyWithoutUserInput = {
    create?: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput> | SubscriptionCreateWithoutUserInput[] | SubscriptionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SubscriptionCreateOrConnectWithoutUserInput | SubscriptionCreateOrConnectWithoutUserInput[]
    createMany?: SubscriptionCreateManyUserInputEnvelope
    connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
  }

  export type WorkspaceMemberCreateNestedManyWithoutUserInput = {
    create?: XOR<WorkspaceMemberCreateWithoutUserInput, WorkspaceMemberUncheckedCreateWithoutUserInput> | WorkspaceMemberCreateWithoutUserInput[] | WorkspaceMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WorkspaceMemberCreateOrConnectWithoutUserInput | WorkspaceMemberCreateOrConnectWithoutUserInput[]
    createMany?: WorkspaceMemberCreateManyUserInputEnvelope
    connect?: WorkspaceMemberWhereUniqueInput | WorkspaceMemberWhereUniqueInput[]
  }

  export type MerchOutcomeFeedbackCreateNestedManyWithoutUserInput = {
    create?: XOR<MerchOutcomeFeedbackCreateWithoutUserInput, MerchOutcomeFeedbackUncheckedCreateWithoutUserInput> | MerchOutcomeFeedbackCreateWithoutUserInput[] | MerchOutcomeFeedbackUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MerchOutcomeFeedbackCreateOrConnectWithoutUserInput | MerchOutcomeFeedbackCreateOrConnectWithoutUserInput[]
    createMany?: MerchOutcomeFeedbackCreateManyUserInputEnvelope
    connect?: MerchOutcomeFeedbackWhereUniqueInput | MerchOutcomeFeedbackWhereUniqueInput[]
  }

  export type AccountUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type SessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type SubscriptionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput> | SubscriptionCreateWithoutUserInput[] | SubscriptionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SubscriptionCreateOrConnectWithoutUserInput | SubscriptionCreateOrConnectWithoutUserInput[]
    createMany?: SubscriptionCreateManyUserInputEnvelope
    connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
  }

  export type WorkspaceMemberUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<WorkspaceMemberCreateWithoutUserInput, WorkspaceMemberUncheckedCreateWithoutUserInput> | WorkspaceMemberCreateWithoutUserInput[] | WorkspaceMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WorkspaceMemberCreateOrConnectWithoutUserInput | WorkspaceMemberCreateOrConnectWithoutUserInput[]
    createMany?: WorkspaceMemberCreateManyUserInputEnvelope
    connect?: WorkspaceMemberWhereUniqueInput | WorkspaceMemberWhereUniqueInput[]
  }

  export type MerchOutcomeFeedbackUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<MerchOutcomeFeedbackCreateWithoutUserInput, MerchOutcomeFeedbackUncheckedCreateWithoutUserInput> | MerchOutcomeFeedbackCreateWithoutUserInput[] | MerchOutcomeFeedbackUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MerchOutcomeFeedbackCreateOrConnectWithoutUserInput | MerchOutcomeFeedbackCreateOrConnectWithoutUserInput[]
    createMany?: MerchOutcomeFeedbackCreateManyUserInputEnvelope
    connect?: MerchOutcomeFeedbackWhereUniqueInput | MerchOutcomeFeedbackWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type AccountUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type SessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type SubscriptionUpdateManyWithoutUserNestedInput = {
    create?: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput> | SubscriptionCreateWithoutUserInput[] | SubscriptionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SubscriptionCreateOrConnectWithoutUserInput | SubscriptionCreateOrConnectWithoutUserInput[]
    upsert?: SubscriptionUpsertWithWhereUniqueWithoutUserInput | SubscriptionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SubscriptionCreateManyUserInputEnvelope
    set?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    disconnect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    delete?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    update?: SubscriptionUpdateWithWhereUniqueWithoutUserInput | SubscriptionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SubscriptionUpdateManyWithWhereWithoutUserInput | SubscriptionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SubscriptionScalarWhereInput | SubscriptionScalarWhereInput[]
  }

  export type WorkspaceMemberUpdateManyWithoutUserNestedInput = {
    create?: XOR<WorkspaceMemberCreateWithoutUserInput, WorkspaceMemberUncheckedCreateWithoutUserInput> | WorkspaceMemberCreateWithoutUserInput[] | WorkspaceMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WorkspaceMemberCreateOrConnectWithoutUserInput | WorkspaceMemberCreateOrConnectWithoutUserInput[]
    upsert?: WorkspaceMemberUpsertWithWhereUniqueWithoutUserInput | WorkspaceMemberUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: WorkspaceMemberCreateManyUserInputEnvelope
    set?: WorkspaceMemberWhereUniqueInput | WorkspaceMemberWhereUniqueInput[]
    disconnect?: WorkspaceMemberWhereUniqueInput | WorkspaceMemberWhereUniqueInput[]
    delete?: WorkspaceMemberWhereUniqueInput | WorkspaceMemberWhereUniqueInput[]
    connect?: WorkspaceMemberWhereUniqueInput | WorkspaceMemberWhereUniqueInput[]
    update?: WorkspaceMemberUpdateWithWhereUniqueWithoutUserInput | WorkspaceMemberUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: WorkspaceMemberUpdateManyWithWhereWithoutUserInput | WorkspaceMemberUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: WorkspaceMemberScalarWhereInput | WorkspaceMemberScalarWhereInput[]
  }

  export type MerchOutcomeFeedbackUpdateManyWithoutUserNestedInput = {
    create?: XOR<MerchOutcomeFeedbackCreateWithoutUserInput, MerchOutcomeFeedbackUncheckedCreateWithoutUserInput> | MerchOutcomeFeedbackCreateWithoutUserInput[] | MerchOutcomeFeedbackUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MerchOutcomeFeedbackCreateOrConnectWithoutUserInput | MerchOutcomeFeedbackCreateOrConnectWithoutUserInput[]
    upsert?: MerchOutcomeFeedbackUpsertWithWhereUniqueWithoutUserInput | MerchOutcomeFeedbackUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: MerchOutcomeFeedbackCreateManyUserInputEnvelope
    set?: MerchOutcomeFeedbackWhereUniqueInput | MerchOutcomeFeedbackWhereUniqueInput[]
    disconnect?: MerchOutcomeFeedbackWhereUniqueInput | MerchOutcomeFeedbackWhereUniqueInput[]
    delete?: MerchOutcomeFeedbackWhereUniqueInput | MerchOutcomeFeedbackWhereUniqueInput[]
    connect?: MerchOutcomeFeedbackWhereUniqueInput | MerchOutcomeFeedbackWhereUniqueInput[]
    update?: MerchOutcomeFeedbackUpdateWithWhereUniqueWithoutUserInput | MerchOutcomeFeedbackUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: MerchOutcomeFeedbackUpdateManyWithWhereWithoutUserInput | MerchOutcomeFeedbackUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: MerchOutcomeFeedbackScalarWhereInput | MerchOutcomeFeedbackScalarWhereInput[]
  }

  export type AccountUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type SessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type SubscriptionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput> | SubscriptionCreateWithoutUserInput[] | SubscriptionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SubscriptionCreateOrConnectWithoutUserInput | SubscriptionCreateOrConnectWithoutUserInput[]
    upsert?: SubscriptionUpsertWithWhereUniqueWithoutUserInput | SubscriptionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SubscriptionCreateManyUserInputEnvelope
    set?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    disconnect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    delete?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    update?: SubscriptionUpdateWithWhereUniqueWithoutUserInput | SubscriptionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SubscriptionUpdateManyWithWhereWithoutUserInput | SubscriptionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SubscriptionScalarWhereInput | SubscriptionScalarWhereInput[]
  }

  export type WorkspaceMemberUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<WorkspaceMemberCreateWithoutUserInput, WorkspaceMemberUncheckedCreateWithoutUserInput> | WorkspaceMemberCreateWithoutUserInput[] | WorkspaceMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WorkspaceMemberCreateOrConnectWithoutUserInput | WorkspaceMemberCreateOrConnectWithoutUserInput[]
    upsert?: WorkspaceMemberUpsertWithWhereUniqueWithoutUserInput | WorkspaceMemberUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: WorkspaceMemberCreateManyUserInputEnvelope
    set?: WorkspaceMemberWhereUniqueInput | WorkspaceMemberWhereUniqueInput[]
    disconnect?: WorkspaceMemberWhereUniqueInput | WorkspaceMemberWhereUniqueInput[]
    delete?: WorkspaceMemberWhereUniqueInput | WorkspaceMemberWhereUniqueInput[]
    connect?: WorkspaceMemberWhereUniqueInput | WorkspaceMemberWhereUniqueInput[]
    update?: WorkspaceMemberUpdateWithWhereUniqueWithoutUserInput | WorkspaceMemberUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: WorkspaceMemberUpdateManyWithWhereWithoutUserInput | WorkspaceMemberUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: WorkspaceMemberScalarWhereInput | WorkspaceMemberScalarWhereInput[]
  }

  export type MerchOutcomeFeedbackUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<MerchOutcomeFeedbackCreateWithoutUserInput, MerchOutcomeFeedbackUncheckedCreateWithoutUserInput> | MerchOutcomeFeedbackCreateWithoutUserInput[] | MerchOutcomeFeedbackUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MerchOutcomeFeedbackCreateOrConnectWithoutUserInput | MerchOutcomeFeedbackCreateOrConnectWithoutUserInput[]
    upsert?: MerchOutcomeFeedbackUpsertWithWhereUniqueWithoutUserInput | MerchOutcomeFeedbackUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: MerchOutcomeFeedbackCreateManyUserInputEnvelope
    set?: MerchOutcomeFeedbackWhereUniqueInput | MerchOutcomeFeedbackWhereUniqueInput[]
    disconnect?: MerchOutcomeFeedbackWhereUniqueInput | MerchOutcomeFeedbackWhereUniqueInput[]
    delete?: MerchOutcomeFeedbackWhereUniqueInput | MerchOutcomeFeedbackWhereUniqueInput[]
    connect?: MerchOutcomeFeedbackWhereUniqueInput | MerchOutcomeFeedbackWhereUniqueInput[]
    update?: MerchOutcomeFeedbackUpdateWithWhereUniqueWithoutUserInput | MerchOutcomeFeedbackUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: MerchOutcomeFeedbackUpdateManyWithWhereWithoutUserInput | MerchOutcomeFeedbackUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: MerchOutcomeFeedbackScalarWhereInput | MerchOutcomeFeedbackScalarWhereInput[]
  }

  export type ProjectCreateNestedManyWithoutWorkspaceInput = {
    create?: XOR<ProjectCreateWithoutWorkspaceInput, ProjectUncheckedCreateWithoutWorkspaceInput> | ProjectCreateWithoutWorkspaceInput[] | ProjectUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutWorkspaceInput | ProjectCreateOrConnectWithoutWorkspaceInput[]
    createMany?: ProjectCreateManyWorkspaceInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type WorkspaceMemberCreateNestedManyWithoutWorkspaceInput = {
    create?: XOR<WorkspaceMemberCreateWithoutWorkspaceInput, WorkspaceMemberUncheckedCreateWithoutWorkspaceInput> | WorkspaceMemberCreateWithoutWorkspaceInput[] | WorkspaceMemberUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: WorkspaceMemberCreateOrConnectWithoutWorkspaceInput | WorkspaceMemberCreateOrConnectWithoutWorkspaceInput[]
    createMany?: WorkspaceMemberCreateManyWorkspaceInputEnvelope
    connect?: WorkspaceMemberWhereUniqueInput | WorkspaceMemberWhereUniqueInput[]
  }

  export type ProjectUncheckedCreateNestedManyWithoutWorkspaceInput = {
    create?: XOR<ProjectCreateWithoutWorkspaceInput, ProjectUncheckedCreateWithoutWorkspaceInput> | ProjectCreateWithoutWorkspaceInput[] | ProjectUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutWorkspaceInput | ProjectCreateOrConnectWithoutWorkspaceInput[]
    createMany?: ProjectCreateManyWorkspaceInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type WorkspaceMemberUncheckedCreateNestedManyWithoutWorkspaceInput = {
    create?: XOR<WorkspaceMemberCreateWithoutWorkspaceInput, WorkspaceMemberUncheckedCreateWithoutWorkspaceInput> | WorkspaceMemberCreateWithoutWorkspaceInput[] | WorkspaceMemberUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: WorkspaceMemberCreateOrConnectWithoutWorkspaceInput | WorkspaceMemberCreateOrConnectWithoutWorkspaceInput[]
    createMany?: WorkspaceMemberCreateManyWorkspaceInputEnvelope
    connect?: WorkspaceMemberWhereUniqueInput | WorkspaceMemberWhereUniqueInput[]
  }

  export type ProjectUpdateManyWithoutWorkspaceNestedInput = {
    create?: XOR<ProjectCreateWithoutWorkspaceInput, ProjectUncheckedCreateWithoutWorkspaceInput> | ProjectCreateWithoutWorkspaceInput[] | ProjectUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutWorkspaceInput | ProjectCreateOrConnectWithoutWorkspaceInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutWorkspaceInput | ProjectUpsertWithWhereUniqueWithoutWorkspaceInput[]
    createMany?: ProjectCreateManyWorkspaceInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutWorkspaceInput | ProjectUpdateWithWhereUniqueWithoutWorkspaceInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutWorkspaceInput | ProjectUpdateManyWithWhereWithoutWorkspaceInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type WorkspaceMemberUpdateManyWithoutWorkspaceNestedInput = {
    create?: XOR<WorkspaceMemberCreateWithoutWorkspaceInput, WorkspaceMemberUncheckedCreateWithoutWorkspaceInput> | WorkspaceMemberCreateWithoutWorkspaceInput[] | WorkspaceMemberUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: WorkspaceMemberCreateOrConnectWithoutWorkspaceInput | WorkspaceMemberCreateOrConnectWithoutWorkspaceInput[]
    upsert?: WorkspaceMemberUpsertWithWhereUniqueWithoutWorkspaceInput | WorkspaceMemberUpsertWithWhereUniqueWithoutWorkspaceInput[]
    createMany?: WorkspaceMemberCreateManyWorkspaceInputEnvelope
    set?: WorkspaceMemberWhereUniqueInput | WorkspaceMemberWhereUniqueInput[]
    disconnect?: WorkspaceMemberWhereUniqueInput | WorkspaceMemberWhereUniqueInput[]
    delete?: WorkspaceMemberWhereUniqueInput | WorkspaceMemberWhereUniqueInput[]
    connect?: WorkspaceMemberWhereUniqueInput | WorkspaceMemberWhereUniqueInput[]
    update?: WorkspaceMemberUpdateWithWhereUniqueWithoutWorkspaceInput | WorkspaceMemberUpdateWithWhereUniqueWithoutWorkspaceInput[]
    updateMany?: WorkspaceMemberUpdateManyWithWhereWithoutWorkspaceInput | WorkspaceMemberUpdateManyWithWhereWithoutWorkspaceInput[]
    deleteMany?: WorkspaceMemberScalarWhereInput | WorkspaceMemberScalarWhereInput[]
  }

  export type ProjectUncheckedUpdateManyWithoutWorkspaceNestedInput = {
    create?: XOR<ProjectCreateWithoutWorkspaceInput, ProjectUncheckedCreateWithoutWorkspaceInput> | ProjectCreateWithoutWorkspaceInput[] | ProjectUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutWorkspaceInput | ProjectCreateOrConnectWithoutWorkspaceInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutWorkspaceInput | ProjectUpsertWithWhereUniqueWithoutWorkspaceInput[]
    createMany?: ProjectCreateManyWorkspaceInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutWorkspaceInput | ProjectUpdateWithWhereUniqueWithoutWorkspaceInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutWorkspaceInput | ProjectUpdateManyWithWhereWithoutWorkspaceInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type WorkspaceMemberUncheckedUpdateManyWithoutWorkspaceNestedInput = {
    create?: XOR<WorkspaceMemberCreateWithoutWorkspaceInput, WorkspaceMemberUncheckedCreateWithoutWorkspaceInput> | WorkspaceMemberCreateWithoutWorkspaceInput[] | WorkspaceMemberUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: WorkspaceMemberCreateOrConnectWithoutWorkspaceInput | WorkspaceMemberCreateOrConnectWithoutWorkspaceInput[]
    upsert?: WorkspaceMemberUpsertWithWhereUniqueWithoutWorkspaceInput | WorkspaceMemberUpsertWithWhereUniqueWithoutWorkspaceInput[]
    createMany?: WorkspaceMemberCreateManyWorkspaceInputEnvelope
    set?: WorkspaceMemberWhereUniqueInput | WorkspaceMemberWhereUniqueInput[]
    disconnect?: WorkspaceMemberWhereUniqueInput | WorkspaceMemberWhereUniqueInput[]
    delete?: WorkspaceMemberWhereUniqueInput | WorkspaceMemberWhereUniqueInput[]
    connect?: WorkspaceMemberWhereUniqueInput | WorkspaceMemberWhereUniqueInput[]
    update?: WorkspaceMemberUpdateWithWhereUniqueWithoutWorkspaceInput | WorkspaceMemberUpdateWithWhereUniqueWithoutWorkspaceInput[]
    updateMany?: WorkspaceMemberUpdateManyWithWhereWithoutWorkspaceInput | WorkspaceMemberUpdateManyWithWhereWithoutWorkspaceInput[]
    deleteMany?: WorkspaceMemberScalarWhereInput | WorkspaceMemberScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutWorkspacesInput = {
    create?: XOR<UserCreateWithoutWorkspacesInput, UserUncheckedCreateWithoutWorkspacesInput>
    connectOrCreate?: UserCreateOrConnectWithoutWorkspacesInput
    connect?: UserWhereUniqueInput
  }

  export type WorkspaceCreateNestedOneWithoutMembersInput = {
    create?: XOR<WorkspaceCreateWithoutMembersInput, WorkspaceUncheckedCreateWithoutMembersInput>
    connectOrCreate?: WorkspaceCreateOrConnectWithoutMembersInput
    connect?: WorkspaceWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutWorkspacesNestedInput = {
    create?: XOR<UserCreateWithoutWorkspacesInput, UserUncheckedCreateWithoutWorkspacesInput>
    connectOrCreate?: UserCreateOrConnectWithoutWorkspacesInput
    upsert?: UserUpsertWithoutWorkspacesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutWorkspacesInput, UserUpdateWithoutWorkspacesInput>, UserUncheckedUpdateWithoutWorkspacesInput>
  }

  export type WorkspaceUpdateOneRequiredWithoutMembersNestedInput = {
    create?: XOR<WorkspaceCreateWithoutMembersInput, WorkspaceUncheckedCreateWithoutMembersInput>
    connectOrCreate?: WorkspaceCreateOrConnectWithoutMembersInput
    upsert?: WorkspaceUpsertWithoutMembersInput
    connect?: WorkspaceWhereUniqueInput
    update?: XOR<XOR<WorkspaceUpdateToOneWithWhereWithoutMembersInput, WorkspaceUpdateWithoutMembersInput>, WorkspaceUncheckedUpdateWithoutMembersInput>
  }

  export type NicheCreateNestedManyWithoutProjectInput = {
    create?: XOR<NicheCreateWithoutProjectInput, NicheUncheckedCreateWithoutProjectInput> | NicheCreateWithoutProjectInput[] | NicheUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: NicheCreateOrConnectWithoutProjectInput | NicheCreateOrConnectWithoutProjectInput[]
    createMany?: NicheCreateManyProjectInputEnvelope
    connect?: NicheWhereUniqueInput | NicheWhereUniqueInput[]
  }

  export type WorkspaceCreateNestedOneWithoutProjectsInput = {
    create?: XOR<WorkspaceCreateWithoutProjectsInput, WorkspaceUncheckedCreateWithoutProjectsInput>
    connectOrCreate?: WorkspaceCreateOrConnectWithoutProjectsInput
    connect?: WorkspaceWhereUniqueInput
  }

  export type NicheUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<NicheCreateWithoutProjectInput, NicheUncheckedCreateWithoutProjectInput> | NicheCreateWithoutProjectInput[] | NicheUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: NicheCreateOrConnectWithoutProjectInput | NicheCreateOrConnectWithoutProjectInput[]
    createMany?: NicheCreateManyProjectInputEnvelope
    connect?: NicheWhereUniqueInput | NicheWhereUniqueInput[]
  }

  export type NicheUpdateManyWithoutProjectNestedInput = {
    create?: XOR<NicheCreateWithoutProjectInput, NicheUncheckedCreateWithoutProjectInput> | NicheCreateWithoutProjectInput[] | NicheUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: NicheCreateOrConnectWithoutProjectInput | NicheCreateOrConnectWithoutProjectInput[]
    upsert?: NicheUpsertWithWhereUniqueWithoutProjectInput | NicheUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: NicheCreateManyProjectInputEnvelope
    set?: NicheWhereUniqueInput | NicheWhereUniqueInput[]
    disconnect?: NicheWhereUniqueInput | NicheWhereUniqueInput[]
    delete?: NicheWhereUniqueInput | NicheWhereUniqueInput[]
    connect?: NicheWhereUniqueInput | NicheWhereUniqueInput[]
    update?: NicheUpdateWithWhereUniqueWithoutProjectInput | NicheUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: NicheUpdateManyWithWhereWithoutProjectInput | NicheUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: NicheScalarWhereInput | NicheScalarWhereInput[]
  }

  export type WorkspaceUpdateOneRequiredWithoutProjectsNestedInput = {
    create?: XOR<WorkspaceCreateWithoutProjectsInput, WorkspaceUncheckedCreateWithoutProjectsInput>
    connectOrCreate?: WorkspaceCreateOrConnectWithoutProjectsInput
    upsert?: WorkspaceUpsertWithoutProjectsInput
    connect?: WorkspaceWhereUniqueInput
    update?: XOR<XOR<WorkspaceUpdateToOneWithWhereWithoutProjectsInput, WorkspaceUpdateWithoutProjectsInput>, WorkspaceUncheckedUpdateWithoutProjectsInput>
  }

  export type NicheUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<NicheCreateWithoutProjectInput, NicheUncheckedCreateWithoutProjectInput> | NicheCreateWithoutProjectInput[] | NicheUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: NicheCreateOrConnectWithoutProjectInput | NicheCreateOrConnectWithoutProjectInput[]
    upsert?: NicheUpsertWithWhereUniqueWithoutProjectInput | NicheUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: NicheCreateManyProjectInputEnvelope
    set?: NicheWhereUniqueInput | NicheWhereUniqueInput[]
    disconnect?: NicheWhereUniqueInput | NicheWhereUniqueInput[]
    delete?: NicheWhereUniqueInput | NicheWhereUniqueInput[]
    connect?: NicheWhereUniqueInput | NicheWhereUniqueInput[]
    update?: NicheUpdateWithWhereUniqueWithoutProjectInput | NicheUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: NicheUpdateManyWithWhereWithoutProjectInput | NicheUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: NicheScalarWhereInput | NicheScalarWhereInput[]
  }

  export type ProjectCreateNestedOneWithoutNichesInput = {
    create?: XOR<ProjectCreateWithoutNichesInput, ProjectUncheckedCreateWithoutNichesInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutNichesInput
    connect?: ProjectWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ProjectUpdateOneRequiredWithoutNichesNestedInput = {
    create?: XOR<ProjectCreateWithoutNichesInput, ProjectUncheckedCreateWithoutNichesInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutNichesInput
    upsert?: ProjectUpsertWithoutNichesInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutNichesInput, ProjectUpdateWithoutNichesInput>, ProjectUncheckedUpdateWithoutNichesInput>
  }

  export type UserCreateNestedOneWithoutSubscriptionsInput = {
    create?: XOR<UserCreateWithoutSubscriptionsInput, UserUncheckedCreateWithoutSubscriptionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSubscriptionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSubscriptionsNestedInput = {
    create?: XOR<UserCreateWithoutSubscriptionsInput, UserUncheckedCreateWithoutSubscriptionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSubscriptionsInput
    upsert?: UserUpsertWithoutSubscriptionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSubscriptionsInput, UserUpdateWithoutSubscriptionsInput>, UserUncheckedUpdateWithoutSubscriptionsInput>
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type MerchOutcomeFeedbackCreatetagsInput = {
    set: string[]
  }

  export type UserCreateNestedOneWithoutMerchOutcomeFeedbackInput = {
    create?: XOR<UserCreateWithoutMerchOutcomeFeedbackInput, UserUncheckedCreateWithoutMerchOutcomeFeedbackInput>
    connectOrCreate?: UserCreateOrConnectWithoutMerchOutcomeFeedbackInput
    connect?: UserWhereUniqueInput
  }

  export type MerchOutcomeFeedbackUpdatetagsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type UserUpdateOneRequiredWithoutMerchOutcomeFeedbackNestedInput = {
    create?: XOR<UserCreateWithoutMerchOutcomeFeedbackInput, UserUncheckedCreateWithoutMerchOutcomeFeedbackInput>
    connectOrCreate?: UserCreateOrConnectWithoutMerchOutcomeFeedbackInput
    upsert?: UserUpsertWithoutMerchOutcomeFeedbackInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutMerchOutcomeFeedbackInput, UserUpdateWithoutMerchOutcomeFeedbackInput>, UserUncheckedUpdateWithoutMerchOutcomeFeedbackInput>
  }

  export type SloganPatternCreatenicheHintsInput = {
    set: string[]
  }

  export type SloganPatternUpdatenicheHintsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type ListingQueueCreatebulletsInput = {
    set: string[]
  }

  export type ListingQueueCreatetagsInput = {
    set: string[]
  }

  export type ListingQueueCreateadHooksInput = {
    set: string[]
  }

  export type ListingQueueUpdatebulletsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type ListingQueueUpdatetagsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type ListingQueueUpdateadHooksInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type UserCreateWithoutAccountsInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    password?: string | null
    role?: string
    merchBrand?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionCreateNestedManyWithoutUserInput
    workspaces?: WorkspaceMemberCreateNestedManyWithoutUserInput
    merchOutcomeFeedback?: MerchOutcomeFeedbackCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAccountsInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    password?: string | null
    role?: string
    merchBrand?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutUserInput
    workspaces?: WorkspaceMemberUncheckedCreateNestedManyWithoutUserInput
    merchOutcomeFeedback?: MerchOutcomeFeedbackUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAccountsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
  }

  export type UserUpsertWithoutAccountsInput = {
    update: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAccountsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    merchBrand?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionUpdateManyWithoutUserNestedInput
    workspaces?: WorkspaceMemberUpdateManyWithoutUserNestedInput
    merchOutcomeFeedback?: MerchOutcomeFeedbackUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    merchBrand?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutUserNestedInput
    workspaces?: WorkspaceMemberUncheckedUpdateManyWithoutUserNestedInput
    merchOutcomeFeedback?: MerchOutcomeFeedbackUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutSessionsInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    password?: string | null
    role?: string
    merchBrand?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionCreateNestedManyWithoutUserInput
    workspaces?: WorkspaceMemberCreateNestedManyWithoutUserInput
    merchOutcomeFeedback?: MerchOutcomeFeedbackCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    password?: string | null
    role?: string
    merchBrand?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutUserInput
    workspaces?: WorkspaceMemberUncheckedCreateNestedManyWithoutUserInput
    merchOutcomeFeedback?: MerchOutcomeFeedbackUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    merchBrand?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionUpdateManyWithoutUserNestedInput
    workspaces?: WorkspaceMemberUpdateManyWithoutUserNestedInput
    merchOutcomeFeedback?: MerchOutcomeFeedbackUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    merchBrand?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutUserNestedInput
    workspaces?: WorkspaceMemberUncheckedUpdateManyWithoutUserNestedInput
    merchOutcomeFeedback?: MerchOutcomeFeedbackUncheckedUpdateManyWithoutUserNestedInput
  }

  export type AccountCreateWithoutUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type AccountUncheckedCreateWithoutUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type AccountCreateOrConnectWithoutUserInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountCreateManyUserInputEnvelope = {
    data: AccountCreateManyUserInput | AccountCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SessionCreateWithoutUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
  }

  export type SessionUncheckedCreateWithoutUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
  }

  export type SessionCreateOrConnectWithoutUserInput = {
    where: SessionWhereUniqueInput
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionCreateManyUserInputEnvelope = {
    data: SessionCreateManyUserInput | SessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SubscriptionCreateWithoutUserInput = {
    id?: string
    stripeCustomerId?: string | null
    stripeSubId?: string | null
    plan?: string
    status?: string
    currentPeriodEnd?: Date | string | null
  }

  export type SubscriptionUncheckedCreateWithoutUserInput = {
    id?: string
    stripeCustomerId?: string | null
    stripeSubId?: string | null
    plan?: string
    status?: string
    currentPeriodEnd?: Date | string | null
  }

  export type SubscriptionCreateOrConnectWithoutUserInput = {
    where: SubscriptionWhereUniqueInput
    create: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput>
  }

  export type SubscriptionCreateManyUserInputEnvelope = {
    data: SubscriptionCreateManyUserInput | SubscriptionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type WorkspaceMemberCreateWithoutUserInput = {
    id?: string
    role: string
    workspace: WorkspaceCreateNestedOneWithoutMembersInput
  }

  export type WorkspaceMemberUncheckedCreateWithoutUserInput = {
    id?: string
    workspaceId: string
    role: string
  }

  export type WorkspaceMemberCreateOrConnectWithoutUserInput = {
    where: WorkspaceMemberWhereUniqueInput
    create: XOR<WorkspaceMemberCreateWithoutUserInput, WorkspaceMemberUncheckedCreateWithoutUserInput>
  }

  export type WorkspaceMemberCreateManyUserInputEnvelope = {
    data: WorkspaceMemberCreateManyUserInput | WorkspaceMemberCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type MerchOutcomeFeedbackCreateWithoutUserInput = {
    id?: string
    niche: string
    nicheKey: string
    platform: string
    slogan: string
    sloganKey: string
    pattern?: string | null
    tags?: MerchOutcomeFeedbackCreatetagsInput | string[]
    audience?: string | null
    style?: string | null
    productTitle?: string | null
    visualBatchMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualStrategyMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualReleaseGate?: NullableJsonNullValueInput | InputJsonValue
    impressions?: number
    clicks?: number
    orders?: number
    favorites?: number
    revenue?: number
    refunds?: number
    observedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MerchOutcomeFeedbackUncheckedCreateWithoutUserInput = {
    id?: string
    niche: string
    nicheKey: string
    platform: string
    slogan: string
    sloganKey: string
    pattern?: string | null
    tags?: MerchOutcomeFeedbackCreatetagsInput | string[]
    audience?: string | null
    style?: string | null
    productTitle?: string | null
    visualBatchMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualStrategyMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualReleaseGate?: NullableJsonNullValueInput | InputJsonValue
    impressions?: number
    clicks?: number
    orders?: number
    favorites?: number
    revenue?: number
    refunds?: number
    observedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MerchOutcomeFeedbackCreateOrConnectWithoutUserInput = {
    where: MerchOutcomeFeedbackWhereUniqueInput
    create: XOR<MerchOutcomeFeedbackCreateWithoutUserInput, MerchOutcomeFeedbackUncheckedCreateWithoutUserInput>
  }

  export type MerchOutcomeFeedbackCreateManyUserInputEnvelope = {
    data: MerchOutcomeFeedbackCreateManyUserInput | MerchOutcomeFeedbackCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AccountUpsertWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    update: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountUpdateWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    data: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
  }

  export type AccountUpdateManyWithWhereWithoutUserInput = {
    where: AccountScalarWhereInput
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyWithoutUserInput>
  }

  export type AccountScalarWhereInput = {
    AND?: AccountScalarWhereInput | AccountScalarWhereInput[]
    OR?: AccountScalarWhereInput[]
    NOT?: AccountScalarWhereInput | AccountScalarWhereInput[]
    id?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refresh_token?: StringNullableFilter<"Account"> | string | null
    access_token?: StringNullableFilter<"Account"> | string | null
    expires_at?: IntNullableFilter<"Account"> | number | null
    token_type?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    id_token?: StringNullableFilter<"Account"> | string | null
    session_state?: StringNullableFilter<"Account"> | string | null
  }

  export type SessionUpsertWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    update: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionUpdateWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    data: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
  }

  export type SessionUpdateManyWithWhereWithoutUserInput = {
    where: SessionScalarWhereInput
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyWithoutUserInput>
  }

  export type SessionScalarWhereInput = {
    AND?: SessionScalarWhereInput | SessionScalarWhereInput[]
    OR?: SessionScalarWhereInput[]
    NOT?: SessionScalarWhereInput | SessionScalarWhereInput[]
    id?: StringFilter<"Session"> | string
    sessionToken?: StringFilter<"Session"> | string
    userId?: StringFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
  }

  export type SubscriptionUpsertWithWhereUniqueWithoutUserInput = {
    where: SubscriptionWhereUniqueInput
    update: XOR<SubscriptionUpdateWithoutUserInput, SubscriptionUncheckedUpdateWithoutUserInput>
    create: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput>
  }

  export type SubscriptionUpdateWithWhereUniqueWithoutUserInput = {
    where: SubscriptionWhereUniqueInput
    data: XOR<SubscriptionUpdateWithoutUserInput, SubscriptionUncheckedUpdateWithoutUserInput>
  }

  export type SubscriptionUpdateManyWithWhereWithoutUserInput = {
    where: SubscriptionScalarWhereInput
    data: XOR<SubscriptionUpdateManyMutationInput, SubscriptionUncheckedUpdateManyWithoutUserInput>
  }

  export type SubscriptionScalarWhereInput = {
    AND?: SubscriptionScalarWhereInput | SubscriptionScalarWhereInput[]
    OR?: SubscriptionScalarWhereInput[]
    NOT?: SubscriptionScalarWhereInput | SubscriptionScalarWhereInput[]
    id?: StringFilter<"Subscription"> | string
    userId?: StringFilter<"Subscription"> | string
    stripeCustomerId?: StringNullableFilter<"Subscription"> | string | null
    stripeSubId?: StringNullableFilter<"Subscription"> | string | null
    plan?: StringFilter<"Subscription"> | string
    status?: StringFilter<"Subscription"> | string
    currentPeriodEnd?: DateTimeNullableFilter<"Subscription"> | Date | string | null
  }

  export type WorkspaceMemberUpsertWithWhereUniqueWithoutUserInput = {
    where: WorkspaceMemberWhereUniqueInput
    update: XOR<WorkspaceMemberUpdateWithoutUserInput, WorkspaceMemberUncheckedUpdateWithoutUserInput>
    create: XOR<WorkspaceMemberCreateWithoutUserInput, WorkspaceMemberUncheckedCreateWithoutUserInput>
  }

  export type WorkspaceMemberUpdateWithWhereUniqueWithoutUserInput = {
    where: WorkspaceMemberWhereUniqueInput
    data: XOR<WorkspaceMemberUpdateWithoutUserInput, WorkspaceMemberUncheckedUpdateWithoutUserInput>
  }

  export type WorkspaceMemberUpdateManyWithWhereWithoutUserInput = {
    where: WorkspaceMemberScalarWhereInput
    data: XOR<WorkspaceMemberUpdateManyMutationInput, WorkspaceMemberUncheckedUpdateManyWithoutUserInput>
  }

  export type WorkspaceMemberScalarWhereInput = {
    AND?: WorkspaceMemberScalarWhereInput | WorkspaceMemberScalarWhereInput[]
    OR?: WorkspaceMemberScalarWhereInput[]
    NOT?: WorkspaceMemberScalarWhereInput | WorkspaceMemberScalarWhereInput[]
    id?: StringFilter<"WorkspaceMember"> | string
    userId?: StringFilter<"WorkspaceMember"> | string
    workspaceId?: StringFilter<"WorkspaceMember"> | string
    role?: StringFilter<"WorkspaceMember"> | string
  }

  export type MerchOutcomeFeedbackUpsertWithWhereUniqueWithoutUserInput = {
    where: MerchOutcomeFeedbackWhereUniqueInput
    update: XOR<MerchOutcomeFeedbackUpdateWithoutUserInput, MerchOutcomeFeedbackUncheckedUpdateWithoutUserInput>
    create: XOR<MerchOutcomeFeedbackCreateWithoutUserInput, MerchOutcomeFeedbackUncheckedCreateWithoutUserInput>
  }

  export type MerchOutcomeFeedbackUpdateWithWhereUniqueWithoutUserInput = {
    where: MerchOutcomeFeedbackWhereUniqueInput
    data: XOR<MerchOutcomeFeedbackUpdateWithoutUserInput, MerchOutcomeFeedbackUncheckedUpdateWithoutUserInput>
  }

  export type MerchOutcomeFeedbackUpdateManyWithWhereWithoutUserInput = {
    where: MerchOutcomeFeedbackScalarWhereInput
    data: XOR<MerchOutcomeFeedbackUpdateManyMutationInput, MerchOutcomeFeedbackUncheckedUpdateManyWithoutUserInput>
  }

  export type MerchOutcomeFeedbackScalarWhereInput = {
    AND?: MerchOutcomeFeedbackScalarWhereInput | MerchOutcomeFeedbackScalarWhereInput[]
    OR?: MerchOutcomeFeedbackScalarWhereInput[]
    NOT?: MerchOutcomeFeedbackScalarWhereInput | MerchOutcomeFeedbackScalarWhereInput[]
    id?: StringFilter<"MerchOutcomeFeedback"> | string
    userId?: StringFilter<"MerchOutcomeFeedback"> | string
    niche?: StringFilter<"MerchOutcomeFeedback"> | string
    nicheKey?: StringFilter<"MerchOutcomeFeedback"> | string
    platform?: StringFilter<"MerchOutcomeFeedback"> | string
    slogan?: StringFilter<"MerchOutcomeFeedback"> | string
    sloganKey?: StringFilter<"MerchOutcomeFeedback"> | string
    pattern?: StringNullableFilter<"MerchOutcomeFeedback"> | string | null
    tags?: StringNullableListFilter<"MerchOutcomeFeedback">
    audience?: StringNullableFilter<"MerchOutcomeFeedback"> | string | null
    style?: StringNullableFilter<"MerchOutcomeFeedback"> | string | null
    productTitle?: StringNullableFilter<"MerchOutcomeFeedback"> | string | null
    visualBatchMetrics?: JsonNullableFilter<"MerchOutcomeFeedback">
    visualStrategyMetrics?: JsonNullableFilter<"MerchOutcomeFeedback">
    visualReleaseGate?: JsonNullableFilter<"MerchOutcomeFeedback">
    impressions?: IntFilter<"MerchOutcomeFeedback"> | number
    clicks?: IntFilter<"MerchOutcomeFeedback"> | number
    orders?: IntFilter<"MerchOutcomeFeedback"> | number
    favorites?: IntFilter<"MerchOutcomeFeedback"> | number
    revenue?: FloatFilter<"MerchOutcomeFeedback"> | number
    refunds?: IntFilter<"MerchOutcomeFeedback"> | number
    observedAt?: DateTimeFilter<"MerchOutcomeFeedback"> | Date | string
    createdAt?: DateTimeFilter<"MerchOutcomeFeedback"> | Date | string
    updatedAt?: DateTimeFilter<"MerchOutcomeFeedback"> | Date | string
  }

  export type ProjectCreateWithoutWorkspaceInput = {
    id?: string
    name: string
    createdAt?: Date | string
    niches?: NicheCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutWorkspaceInput = {
    id?: string
    name: string
    createdAt?: Date | string
    niches?: NicheUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutWorkspaceInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutWorkspaceInput, ProjectUncheckedCreateWithoutWorkspaceInput>
  }

  export type ProjectCreateManyWorkspaceInputEnvelope = {
    data: ProjectCreateManyWorkspaceInput | ProjectCreateManyWorkspaceInput[]
    skipDuplicates?: boolean
  }

  export type WorkspaceMemberCreateWithoutWorkspaceInput = {
    id?: string
    role: string
    user: UserCreateNestedOneWithoutWorkspacesInput
  }

  export type WorkspaceMemberUncheckedCreateWithoutWorkspaceInput = {
    id?: string
    userId: string
    role: string
  }

  export type WorkspaceMemberCreateOrConnectWithoutWorkspaceInput = {
    where: WorkspaceMemberWhereUniqueInput
    create: XOR<WorkspaceMemberCreateWithoutWorkspaceInput, WorkspaceMemberUncheckedCreateWithoutWorkspaceInput>
  }

  export type WorkspaceMemberCreateManyWorkspaceInputEnvelope = {
    data: WorkspaceMemberCreateManyWorkspaceInput | WorkspaceMemberCreateManyWorkspaceInput[]
    skipDuplicates?: boolean
  }

  export type ProjectUpsertWithWhereUniqueWithoutWorkspaceInput = {
    where: ProjectWhereUniqueInput
    update: XOR<ProjectUpdateWithoutWorkspaceInput, ProjectUncheckedUpdateWithoutWorkspaceInput>
    create: XOR<ProjectCreateWithoutWorkspaceInput, ProjectUncheckedCreateWithoutWorkspaceInput>
  }

  export type ProjectUpdateWithWhereUniqueWithoutWorkspaceInput = {
    where: ProjectWhereUniqueInput
    data: XOR<ProjectUpdateWithoutWorkspaceInput, ProjectUncheckedUpdateWithoutWorkspaceInput>
  }

  export type ProjectUpdateManyWithWhereWithoutWorkspaceInput = {
    where: ProjectScalarWhereInput
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyWithoutWorkspaceInput>
  }

  export type ProjectScalarWhereInput = {
    AND?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
    OR?: ProjectScalarWhereInput[]
    NOT?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
    id?: StringFilter<"Project"> | string
    name?: StringFilter<"Project"> | string
    workspaceId?: StringFilter<"Project"> | string
    createdAt?: DateTimeFilter<"Project"> | Date | string
  }

  export type WorkspaceMemberUpsertWithWhereUniqueWithoutWorkspaceInput = {
    where: WorkspaceMemberWhereUniqueInput
    update: XOR<WorkspaceMemberUpdateWithoutWorkspaceInput, WorkspaceMemberUncheckedUpdateWithoutWorkspaceInput>
    create: XOR<WorkspaceMemberCreateWithoutWorkspaceInput, WorkspaceMemberUncheckedCreateWithoutWorkspaceInput>
  }

  export type WorkspaceMemberUpdateWithWhereUniqueWithoutWorkspaceInput = {
    where: WorkspaceMemberWhereUniqueInput
    data: XOR<WorkspaceMemberUpdateWithoutWorkspaceInput, WorkspaceMemberUncheckedUpdateWithoutWorkspaceInput>
  }

  export type WorkspaceMemberUpdateManyWithWhereWithoutWorkspaceInput = {
    where: WorkspaceMemberScalarWhereInput
    data: XOR<WorkspaceMemberUpdateManyMutationInput, WorkspaceMemberUncheckedUpdateManyWithoutWorkspaceInput>
  }

  export type UserCreateWithoutWorkspacesInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    password?: string | null
    role?: string
    merchBrand?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionCreateNestedManyWithoutUserInput
    merchOutcomeFeedback?: MerchOutcomeFeedbackCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutWorkspacesInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    password?: string | null
    role?: string
    merchBrand?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutUserInput
    merchOutcomeFeedback?: MerchOutcomeFeedbackUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutWorkspacesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutWorkspacesInput, UserUncheckedCreateWithoutWorkspacesInput>
  }

  export type WorkspaceCreateWithoutMembersInput = {
    id?: string
    name: string
    ownerId: string
    createdAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutWorkspaceInput
  }

  export type WorkspaceUncheckedCreateWithoutMembersInput = {
    id?: string
    name: string
    ownerId: string
    createdAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutWorkspaceInput
  }

  export type WorkspaceCreateOrConnectWithoutMembersInput = {
    where: WorkspaceWhereUniqueInput
    create: XOR<WorkspaceCreateWithoutMembersInput, WorkspaceUncheckedCreateWithoutMembersInput>
  }

  export type UserUpsertWithoutWorkspacesInput = {
    update: XOR<UserUpdateWithoutWorkspacesInput, UserUncheckedUpdateWithoutWorkspacesInput>
    create: XOR<UserCreateWithoutWorkspacesInput, UserUncheckedCreateWithoutWorkspacesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutWorkspacesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutWorkspacesInput, UserUncheckedUpdateWithoutWorkspacesInput>
  }

  export type UserUpdateWithoutWorkspacesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    merchBrand?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionUpdateManyWithoutUserNestedInput
    merchOutcomeFeedback?: MerchOutcomeFeedbackUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutWorkspacesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    merchBrand?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutUserNestedInput
    merchOutcomeFeedback?: MerchOutcomeFeedbackUncheckedUpdateManyWithoutUserNestedInput
  }

  export type WorkspaceUpsertWithoutMembersInput = {
    update: XOR<WorkspaceUpdateWithoutMembersInput, WorkspaceUncheckedUpdateWithoutMembersInput>
    create: XOR<WorkspaceCreateWithoutMembersInput, WorkspaceUncheckedCreateWithoutMembersInput>
    where?: WorkspaceWhereInput
  }

  export type WorkspaceUpdateToOneWithWhereWithoutMembersInput = {
    where?: WorkspaceWhereInput
    data: XOR<WorkspaceUpdateWithoutMembersInput, WorkspaceUncheckedUpdateWithoutMembersInput>
  }

  export type WorkspaceUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutWorkspaceNestedInput
  }

  export type WorkspaceUncheckedUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutWorkspaceNestedInput
  }

  export type NicheCreateWithoutProjectInput = {
    id?: string
    name: string
    score: number
    trendScore: number
    competitionScore: number
  }

  export type NicheUncheckedCreateWithoutProjectInput = {
    id?: string
    name: string
    score: number
    trendScore: number
    competitionScore: number
  }

  export type NicheCreateOrConnectWithoutProjectInput = {
    where: NicheWhereUniqueInput
    create: XOR<NicheCreateWithoutProjectInput, NicheUncheckedCreateWithoutProjectInput>
  }

  export type NicheCreateManyProjectInputEnvelope = {
    data: NicheCreateManyProjectInput | NicheCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type WorkspaceCreateWithoutProjectsInput = {
    id?: string
    name: string
    ownerId: string
    createdAt?: Date | string
    members?: WorkspaceMemberCreateNestedManyWithoutWorkspaceInput
  }

  export type WorkspaceUncheckedCreateWithoutProjectsInput = {
    id?: string
    name: string
    ownerId: string
    createdAt?: Date | string
    members?: WorkspaceMemberUncheckedCreateNestedManyWithoutWorkspaceInput
  }

  export type WorkspaceCreateOrConnectWithoutProjectsInput = {
    where: WorkspaceWhereUniqueInput
    create: XOR<WorkspaceCreateWithoutProjectsInput, WorkspaceUncheckedCreateWithoutProjectsInput>
  }

  export type NicheUpsertWithWhereUniqueWithoutProjectInput = {
    where: NicheWhereUniqueInput
    update: XOR<NicheUpdateWithoutProjectInput, NicheUncheckedUpdateWithoutProjectInput>
    create: XOR<NicheCreateWithoutProjectInput, NicheUncheckedCreateWithoutProjectInput>
  }

  export type NicheUpdateWithWhereUniqueWithoutProjectInput = {
    where: NicheWhereUniqueInput
    data: XOR<NicheUpdateWithoutProjectInput, NicheUncheckedUpdateWithoutProjectInput>
  }

  export type NicheUpdateManyWithWhereWithoutProjectInput = {
    where: NicheScalarWhereInput
    data: XOR<NicheUpdateManyMutationInput, NicheUncheckedUpdateManyWithoutProjectInput>
  }

  export type NicheScalarWhereInput = {
    AND?: NicheScalarWhereInput | NicheScalarWhereInput[]
    OR?: NicheScalarWhereInput[]
    NOT?: NicheScalarWhereInput | NicheScalarWhereInput[]
    id?: StringFilter<"Niche"> | string
    name?: StringFilter<"Niche"> | string
    score?: FloatFilter<"Niche"> | number
    trendScore?: FloatFilter<"Niche"> | number
    competitionScore?: FloatFilter<"Niche"> | number
    projectId?: StringFilter<"Niche"> | string
  }

  export type WorkspaceUpsertWithoutProjectsInput = {
    update: XOR<WorkspaceUpdateWithoutProjectsInput, WorkspaceUncheckedUpdateWithoutProjectsInput>
    create: XOR<WorkspaceCreateWithoutProjectsInput, WorkspaceUncheckedCreateWithoutProjectsInput>
    where?: WorkspaceWhereInput
  }

  export type WorkspaceUpdateToOneWithWhereWithoutProjectsInput = {
    where?: WorkspaceWhereInput
    data: XOR<WorkspaceUpdateWithoutProjectsInput, WorkspaceUncheckedUpdateWithoutProjectsInput>
  }

  export type WorkspaceUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: WorkspaceMemberUpdateManyWithoutWorkspaceNestedInput
  }

  export type WorkspaceUncheckedUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: WorkspaceMemberUncheckedUpdateManyWithoutWorkspaceNestedInput
  }

  export type ProjectCreateWithoutNichesInput = {
    id?: string
    name: string
    createdAt?: Date | string
    workspace: WorkspaceCreateNestedOneWithoutProjectsInput
  }

  export type ProjectUncheckedCreateWithoutNichesInput = {
    id?: string
    name: string
    workspaceId: string
    createdAt?: Date | string
  }

  export type ProjectCreateOrConnectWithoutNichesInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutNichesInput, ProjectUncheckedCreateWithoutNichesInput>
  }

  export type ProjectUpsertWithoutNichesInput = {
    update: XOR<ProjectUpdateWithoutNichesInput, ProjectUncheckedUpdateWithoutNichesInput>
    create: XOR<ProjectCreateWithoutNichesInput, ProjectUncheckedCreateWithoutNichesInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutNichesInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutNichesInput, ProjectUncheckedUpdateWithoutNichesInput>
  }

  export type ProjectUpdateWithoutNichesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workspace?: WorkspaceUpdateOneRequiredWithoutProjectsNestedInput
  }

  export type ProjectUncheckedUpdateWithoutNichesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutSubscriptionsInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    password?: string | null
    role?: string
    merchBrand?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    workspaces?: WorkspaceMemberCreateNestedManyWithoutUserInput
    merchOutcomeFeedback?: MerchOutcomeFeedbackCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSubscriptionsInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    password?: string | null
    role?: string
    merchBrand?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    workspaces?: WorkspaceMemberUncheckedCreateNestedManyWithoutUserInput
    merchOutcomeFeedback?: MerchOutcomeFeedbackUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSubscriptionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSubscriptionsInput, UserUncheckedCreateWithoutSubscriptionsInput>
  }

  export type UserUpsertWithoutSubscriptionsInput = {
    update: XOR<UserUpdateWithoutSubscriptionsInput, UserUncheckedUpdateWithoutSubscriptionsInput>
    create: XOR<UserCreateWithoutSubscriptionsInput, UserUncheckedCreateWithoutSubscriptionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSubscriptionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSubscriptionsInput, UserUncheckedUpdateWithoutSubscriptionsInput>
  }

  export type UserUpdateWithoutSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    merchBrand?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    workspaces?: WorkspaceMemberUpdateManyWithoutUserNestedInput
    merchOutcomeFeedback?: MerchOutcomeFeedbackUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    merchBrand?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    workspaces?: WorkspaceMemberUncheckedUpdateManyWithoutUserNestedInput
    merchOutcomeFeedback?: MerchOutcomeFeedbackUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutMerchOutcomeFeedbackInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    password?: string | null
    role?: string
    merchBrand?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionCreateNestedManyWithoutUserInput
    workspaces?: WorkspaceMemberCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutMerchOutcomeFeedbackInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    password?: string | null
    role?: string
    merchBrand?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutUserInput
    workspaces?: WorkspaceMemberUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutMerchOutcomeFeedbackInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutMerchOutcomeFeedbackInput, UserUncheckedCreateWithoutMerchOutcomeFeedbackInput>
  }

  export type UserUpsertWithoutMerchOutcomeFeedbackInput = {
    update: XOR<UserUpdateWithoutMerchOutcomeFeedbackInput, UserUncheckedUpdateWithoutMerchOutcomeFeedbackInput>
    create: XOR<UserCreateWithoutMerchOutcomeFeedbackInput, UserUncheckedCreateWithoutMerchOutcomeFeedbackInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutMerchOutcomeFeedbackInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutMerchOutcomeFeedbackInput, UserUncheckedUpdateWithoutMerchOutcomeFeedbackInput>
  }

  export type UserUpdateWithoutMerchOutcomeFeedbackInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    merchBrand?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionUpdateManyWithoutUserNestedInput
    workspaces?: WorkspaceMemberUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutMerchOutcomeFeedbackInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    merchBrand?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutUserNestedInput
    workspaces?: WorkspaceMemberUncheckedUpdateManyWithoutUserNestedInput
  }

  export type AccountCreateManyUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type SessionCreateManyUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
  }

  export type SubscriptionCreateManyUserInput = {
    id?: string
    stripeCustomerId?: string | null
    stripeSubId?: string | null
    plan?: string
    status?: string
    currentPeriodEnd?: Date | string | null
  }

  export type WorkspaceMemberCreateManyUserInput = {
    id?: string
    workspaceId: string
    role: string
  }

  export type MerchOutcomeFeedbackCreateManyUserInput = {
    id?: string
    niche: string
    nicheKey: string
    platform: string
    slogan: string
    sloganKey: string
    pattern?: string | null
    tags?: MerchOutcomeFeedbackCreatetagsInput | string[]
    audience?: string | null
    style?: string | null
    productTitle?: string | null
    visualBatchMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualStrategyMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualReleaseGate?: NullableJsonNullValueInput | InputJsonValue
    impressions?: number
    clicks?: number
    orders?: number
    favorites?: number
    revenue?: number
    refunds?: number
    observedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubId?: NullableStringFieldUpdateOperationsInput | string | null
    plan?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SubscriptionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubId?: NullableStringFieldUpdateOperationsInput | string | null
    plan?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SubscriptionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubId?: NullableStringFieldUpdateOperationsInput | string | null
    plan?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type WorkspaceMemberUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    workspace?: WorkspaceUpdateOneRequiredWithoutMembersNestedInput
  }

  export type WorkspaceMemberUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
  }

  export type WorkspaceMemberUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
  }

  export type MerchOutcomeFeedbackUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    niche?: StringFieldUpdateOperationsInput | string
    nicheKey?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    slogan?: StringFieldUpdateOperationsInput | string
    sloganKey?: StringFieldUpdateOperationsInput | string
    pattern?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: MerchOutcomeFeedbackUpdatetagsInput | string[]
    audience?: NullableStringFieldUpdateOperationsInput | string | null
    style?: NullableStringFieldUpdateOperationsInput | string | null
    productTitle?: NullableStringFieldUpdateOperationsInput | string | null
    visualBatchMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualStrategyMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualReleaseGate?: NullableJsonNullValueInput | InputJsonValue
    impressions?: IntFieldUpdateOperationsInput | number
    clicks?: IntFieldUpdateOperationsInput | number
    orders?: IntFieldUpdateOperationsInput | number
    favorites?: IntFieldUpdateOperationsInput | number
    revenue?: FloatFieldUpdateOperationsInput | number
    refunds?: IntFieldUpdateOperationsInput | number
    observedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MerchOutcomeFeedbackUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    niche?: StringFieldUpdateOperationsInput | string
    nicheKey?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    slogan?: StringFieldUpdateOperationsInput | string
    sloganKey?: StringFieldUpdateOperationsInput | string
    pattern?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: MerchOutcomeFeedbackUpdatetagsInput | string[]
    audience?: NullableStringFieldUpdateOperationsInput | string | null
    style?: NullableStringFieldUpdateOperationsInput | string | null
    productTitle?: NullableStringFieldUpdateOperationsInput | string | null
    visualBatchMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualStrategyMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualReleaseGate?: NullableJsonNullValueInput | InputJsonValue
    impressions?: IntFieldUpdateOperationsInput | number
    clicks?: IntFieldUpdateOperationsInput | number
    orders?: IntFieldUpdateOperationsInput | number
    favorites?: IntFieldUpdateOperationsInput | number
    revenue?: FloatFieldUpdateOperationsInput | number
    refunds?: IntFieldUpdateOperationsInput | number
    observedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MerchOutcomeFeedbackUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    niche?: StringFieldUpdateOperationsInput | string
    nicheKey?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    slogan?: StringFieldUpdateOperationsInput | string
    sloganKey?: StringFieldUpdateOperationsInput | string
    pattern?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: MerchOutcomeFeedbackUpdatetagsInput | string[]
    audience?: NullableStringFieldUpdateOperationsInput | string | null
    style?: NullableStringFieldUpdateOperationsInput | string | null
    productTitle?: NullableStringFieldUpdateOperationsInput | string | null
    visualBatchMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualStrategyMetrics?: NullableJsonNullValueInput | InputJsonValue
    visualReleaseGate?: NullableJsonNullValueInput | InputJsonValue
    impressions?: IntFieldUpdateOperationsInput | number
    clicks?: IntFieldUpdateOperationsInput | number
    orders?: IntFieldUpdateOperationsInput | number
    favorites?: IntFieldUpdateOperationsInput | number
    revenue?: FloatFieldUpdateOperationsInput | number
    refunds?: IntFieldUpdateOperationsInput | number
    observedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectCreateManyWorkspaceInput = {
    id?: string
    name: string
    createdAt?: Date | string
  }

  export type WorkspaceMemberCreateManyWorkspaceInput = {
    id?: string
    userId: string
    role: string
  }

  export type ProjectUpdateWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    niches?: NicheUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    niches?: NicheUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateManyWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkspaceMemberUpdateWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    user?: UserUpdateOneRequiredWithoutWorkspacesNestedInput
  }

  export type WorkspaceMemberUncheckedUpdateWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
  }

  export type WorkspaceMemberUncheckedUpdateManyWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
  }

  export type NicheCreateManyProjectInput = {
    id?: string
    name: string
    score: number
    trendScore: number
    competitionScore: number
  }

  export type NicheUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    trendScore?: FloatFieldUpdateOperationsInput | number
    competitionScore?: FloatFieldUpdateOperationsInput | number
  }

  export type NicheUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    trendScore?: FloatFieldUpdateOperationsInput | number
    competitionScore?: FloatFieldUpdateOperationsInput | number
  }

  export type NicheUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    trendScore?: FloatFieldUpdateOperationsInput | number
    competitionScore?: FloatFieldUpdateOperationsInput | number
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use WorkspaceCountOutputTypeDefaultArgs instead
     */
    export type WorkspaceCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = WorkspaceCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProjectCountOutputTypeDefaultArgs instead
     */
    export type ProjectCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProjectCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AccountDefaultArgs instead
     */
    export type AccountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AccountDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SessionDefaultArgs instead
     */
    export type SessionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SessionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use VerificationTokenDefaultArgs instead
     */
    export type VerificationTokenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = VerificationTokenDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use WorkspaceDefaultArgs instead
     */
    export type WorkspaceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = WorkspaceDefaultArgs<ExtArgs>
    /**
     * @deprecated Use WorkspaceMemberDefaultArgs instead
     */
    export type WorkspaceMemberArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = WorkspaceMemberDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProjectDefaultArgs instead
     */
    export type ProjectArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProjectDefaultArgs<ExtArgs>
    /**
     * @deprecated Use NicheDefaultArgs instead
     */
    export type NicheArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = NicheDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SubscriptionDefaultArgs instead
     */
    export type SubscriptionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SubscriptionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UsageMetricDefaultArgs instead
     */
    export type UsageMetricArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UsageMetricDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AutopilotJobDefaultArgs instead
     */
    export type AutopilotJobArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AutopilotJobDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SignalSnapshotDefaultArgs instead
     */
    export type SignalSnapshotArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SignalSnapshotDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SignalSourceHealthDefaultArgs instead
     */
    export type SignalSourceHealthArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SignalSourceHealthDefaultArgs<ExtArgs>
    /**
     * @deprecated Use MerchOutcomeFeedbackDefaultArgs instead
     */
    export type MerchOutcomeFeedbackArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = MerchOutcomeFeedbackDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SloganPatternDefaultArgs instead
     */
    export type SloganPatternArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SloganPatternDefaultArgs<ExtArgs>
    /**
     * @deprecated Use MarketSignalDefaultArgs instead
     */
    export type MarketSignalArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = MarketSignalDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ListingQueueDefaultArgs instead
     */
    export type ListingQueueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ListingQueueDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ListingPerformanceDefaultArgs instead
     */
    export type ListingPerformanceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ListingPerformanceDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}