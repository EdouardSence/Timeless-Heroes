
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
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Progression
 * 
 */
export type Progression = $Result.DefaultSelection<Prisma.$ProgressionPayload>
/**
 * Model Item
 * 
 */
export type Item = $Result.DefaultSelection<Prisma.$ItemPayload>
/**
 * Model OwnedItem
 * 
 */
export type OwnedItem = $Result.DefaultSelection<Prisma.$OwnedItemPayload>
/**
 * Model ProgramType
 * 
 */
export type ProgramType = $Result.DefaultSelection<Prisma.$ProgramTypePayload>
/**
 * Model ActiveProgram
 * 
 */
export type ActiveProgram = $Result.DefaultSelection<Prisma.$ActiveProgramPayload>
/**
 * Model Transaction
 * 
 */
export type Transaction = $Result.DefaultSelection<Prisma.$TransactionPayload>
/**
 * Model Achievement
 * 
 */
export type Achievement = $Result.DefaultSelection<Prisma.$AchievementPayload>
/**
 * Model UserAchievement
 * 
 */
export type UserAchievement = $Result.DefaultSelection<Prisma.$UserAchievementPayload>
/**
 * Model OfflineSession
 * 
 */
export type OfflineSession = $Result.DefaultSelection<Prisma.$OfflineSessionPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const ItemCategory: {
  HARDWARE: 'HARDWARE',
  SOFTWARE: 'SOFTWARE',
  COFFEE: 'COFFEE',
  TEAM_MEMBER: 'TEAM_MEMBER',
  INFRASTRUCTURE: 'INFRASTRUCTURE'
};

export type ItemCategory = (typeof ItemCategory)[keyof typeof ItemCategory]


export const EffectType: {
  CLICK_BONUS: 'CLICK_BONUS',
  PASSIVE_BONUS: 'PASSIVE_BONUS',
  CLICK_MULTIPLIER: 'CLICK_MULTIPLIER',
  PASSIVE_MULTIPLIER: 'PASSIVE_MULTIPLIER',
  CRIT_CHANCE: 'CRIT_CHANCE',
  CRIT_MULTIPLIER: 'CRIT_MULTIPLIER',
  EXPERIENCE_BONUS: 'EXPERIENCE_BONUS'
};

export type EffectType = (typeof EffectType)[keyof typeof EffectType]


export const Rarity: {
  COMMON: 'COMMON',
  UNCOMMON: 'UNCOMMON',
  RARE: 'RARE',
  EPIC: 'EPIC',
  LEGENDARY: 'LEGENDARY',
  MYTHIC: 'MYTHIC'
};

export type Rarity = (typeof Rarity)[keyof typeof Rarity]


export const ProgramCategory: {
  BUG_FIX: 'BUG_FIX',
  FEATURE: 'FEATURE',
  REFACTORING: 'REFACTORING',
  ARCHITECTURE: 'ARCHITECTURE',
  DEPLOYMENT: 'DEPLOYMENT',
  RESEARCH: 'RESEARCH'
};

export type ProgramCategory = (typeof ProgramCategory)[keyof typeof ProgramCategory]


export const ProgramStatus: {
  RUNNING: 'RUNNING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  FAILED: 'FAILED'
};

export type ProgramStatus = (typeof ProgramStatus)[keyof typeof ProgramStatus]


export const TransactionStatus: {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED'
};

export type TransactionStatus = (typeof TransactionStatus)[keyof typeof TransactionStatus]


export const ProductType: {
  PREMIUM_CURRENCY: 'PREMIUM_CURRENCY',
  ITEM_PACK: 'ITEM_PACK',
  SUBSCRIPTION: 'SUBSCRIPTION',
  BOOST: 'BOOST'
};

export type ProductType = (typeof ProductType)[keyof typeof ProductType]


export const AchievementCondition: {
  TOTAL_LINES_WRITTEN: 'TOTAL_LINES_WRITTEN',
  TOTAL_CLICKS: 'TOTAL_CLICKS',
  TOTAL_PLAYTIME: 'TOTAL_PLAYTIME',
  LEVEL_REACHED: 'LEVEL_REACHED',
  PRESTIGE_LEVEL: 'PRESTIGE_LEVEL',
  ITEMS_OWNED: 'ITEMS_OWNED',
  PROGRAMS_COMPLETED: 'PROGRAMS_COMPLETED',
  CRITICAL_HITS: 'CRITICAL_HITS'
};

export type AchievementCondition = (typeof AchievementCondition)[keyof typeof AchievementCondition]

}

export type ItemCategory = $Enums.ItemCategory

export const ItemCategory: typeof $Enums.ItemCategory

export type EffectType = $Enums.EffectType

export const EffectType: typeof $Enums.EffectType

export type Rarity = $Enums.Rarity

export const Rarity: typeof $Enums.Rarity

export type ProgramCategory = $Enums.ProgramCategory

export const ProgramCategory: typeof $Enums.ProgramCategory

export type ProgramStatus = $Enums.ProgramStatus

export const ProgramStatus: typeof $Enums.ProgramStatus

export type TransactionStatus = $Enums.TransactionStatus

export const TransactionStatus: typeof $Enums.TransactionStatus

export type ProductType = $Enums.ProductType

export const ProductType: typeof $Enums.ProductType

export type AchievementCondition = $Enums.AchievementCondition

export const AchievementCondition: typeof $Enums.AchievementCondition

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
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
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
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
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.progression`: Exposes CRUD operations for the **Progression** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Progressions
    * const progressions = await prisma.progression.findMany()
    * ```
    */
  get progression(): Prisma.ProgressionDelegate<ExtArgs>;

  /**
   * `prisma.item`: Exposes CRUD operations for the **Item** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Items
    * const items = await prisma.item.findMany()
    * ```
    */
  get item(): Prisma.ItemDelegate<ExtArgs>;

  /**
   * `prisma.ownedItem`: Exposes CRUD operations for the **OwnedItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OwnedItems
    * const ownedItems = await prisma.ownedItem.findMany()
    * ```
    */
  get ownedItem(): Prisma.OwnedItemDelegate<ExtArgs>;

  /**
   * `prisma.programType`: Exposes CRUD operations for the **ProgramType** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProgramTypes
    * const programTypes = await prisma.programType.findMany()
    * ```
    */
  get programType(): Prisma.ProgramTypeDelegate<ExtArgs>;

  /**
   * `prisma.activeProgram`: Exposes CRUD operations for the **ActiveProgram** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ActivePrograms
    * const activePrograms = await prisma.activeProgram.findMany()
    * ```
    */
  get activeProgram(): Prisma.ActiveProgramDelegate<ExtArgs>;

  /**
   * `prisma.transaction`: Exposes CRUD operations for the **Transaction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Transactions
    * const transactions = await prisma.transaction.findMany()
    * ```
    */
  get transaction(): Prisma.TransactionDelegate<ExtArgs>;

  /**
   * `prisma.achievement`: Exposes CRUD operations for the **Achievement** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Achievements
    * const achievements = await prisma.achievement.findMany()
    * ```
    */
  get achievement(): Prisma.AchievementDelegate<ExtArgs>;

  /**
   * `prisma.userAchievement`: Exposes CRUD operations for the **UserAchievement** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserAchievements
    * const userAchievements = await prisma.userAchievement.findMany()
    * ```
    */
  get userAchievement(): Prisma.UserAchievementDelegate<ExtArgs>;

  /**
   * `prisma.offlineSession`: Exposes CRUD operations for the **OfflineSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OfflineSessions
    * const offlineSessions = await prisma.offlineSession.findMany()
    * ```
    */
  get offlineSession(): Prisma.OfflineSessionDelegate<ExtArgs>;
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
    User: 'User',
    Progression: 'Progression',
    Item: 'Item',
    OwnedItem: 'OwnedItem',
    ProgramType: 'ProgramType',
    ActiveProgram: 'ActiveProgram',
    Transaction: 'Transaction',
    Achievement: 'Achievement',
    UserAchievement: 'UserAchievement',
    OfflineSession: 'OfflineSession'
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
      modelProps: "user" | "progression" | "item" | "ownedItem" | "programType" | "activeProgram" | "transaction" | "achievement" | "userAchievement" | "offlineSession"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
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
      Progression: {
        payload: Prisma.$ProgressionPayload<ExtArgs>
        fields: Prisma.ProgressionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProgressionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProgressionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressionPayload>
          }
          findFirst: {
            args: Prisma.ProgressionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProgressionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressionPayload>
          }
          findMany: {
            args: Prisma.ProgressionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressionPayload>[]
          }
          create: {
            args: Prisma.ProgressionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressionPayload>
          }
          createMany: {
            args: Prisma.ProgressionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProgressionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressionPayload>[]
          }
          delete: {
            args: Prisma.ProgressionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressionPayload>
          }
          update: {
            args: Prisma.ProgressionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressionPayload>
          }
          deleteMany: {
            args: Prisma.ProgressionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProgressionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProgressionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressionPayload>
          }
          aggregate: {
            args: Prisma.ProgressionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProgression>
          }
          groupBy: {
            args: Prisma.ProgressionGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProgressionGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProgressionCountArgs<ExtArgs>
            result: $Utils.Optional<ProgressionCountAggregateOutputType> | number
          }
        }
      }
      Item: {
        payload: Prisma.$ItemPayload<ExtArgs>
        fields: Prisma.ItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPayload>
          }
          findFirst: {
            args: Prisma.ItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPayload>
          }
          findMany: {
            args: Prisma.ItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPayload>[]
          }
          create: {
            args: Prisma.ItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPayload>
          }
          createMany: {
            args: Prisma.ItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPayload>[]
          }
          delete: {
            args: Prisma.ItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPayload>
          }
          update: {
            args: Prisma.ItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPayload>
          }
          deleteMany: {
            args: Prisma.ItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPayload>
          }
          aggregate: {
            args: Prisma.ItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateItem>
          }
          groupBy: {
            args: Prisma.ItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<ItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.ItemCountArgs<ExtArgs>
            result: $Utils.Optional<ItemCountAggregateOutputType> | number
          }
        }
      }
      OwnedItem: {
        payload: Prisma.$OwnedItemPayload<ExtArgs>
        fields: Prisma.OwnedItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OwnedItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OwnedItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OwnedItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OwnedItemPayload>
          }
          findFirst: {
            args: Prisma.OwnedItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OwnedItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OwnedItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OwnedItemPayload>
          }
          findMany: {
            args: Prisma.OwnedItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OwnedItemPayload>[]
          }
          create: {
            args: Prisma.OwnedItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OwnedItemPayload>
          }
          createMany: {
            args: Prisma.OwnedItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OwnedItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OwnedItemPayload>[]
          }
          delete: {
            args: Prisma.OwnedItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OwnedItemPayload>
          }
          update: {
            args: Prisma.OwnedItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OwnedItemPayload>
          }
          deleteMany: {
            args: Prisma.OwnedItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OwnedItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.OwnedItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OwnedItemPayload>
          }
          aggregate: {
            args: Prisma.OwnedItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOwnedItem>
          }
          groupBy: {
            args: Prisma.OwnedItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<OwnedItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.OwnedItemCountArgs<ExtArgs>
            result: $Utils.Optional<OwnedItemCountAggregateOutputType> | number
          }
        }
      }
      ProgramType: {
        payload: Prisma.$ProgramTypePayload<ExtArgs>
        fields: Prisma.ProgramTypeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProgramTypeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramTypePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProgramTypeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramTypePayload>
          }
          findFirst: {
            args: Prisma.ProgramTypeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramTypePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProgramTypeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramTypePayload>
          }
          findMany: {
            args: Prisma.ProgramTypeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramTypePayload>[]
          }
          create: {
            args: Prisma.ProgramTypeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramTypePayload>
          }
          createMany: {
            args: Prisma.ProgramTypeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProgramTypeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramTypePayload>[]
          }
          delete: {
            args: Prisma.ProgramTypeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramTypePayload>
          }
          update: {
            args: Prisma.ProgramTypeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramTypePayload>
          }
          deleteMany: {
            args: Prisma.ProgramTypeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProgramTypeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProgramTypeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgramTypePayload>
          }
          aggregate: {
            args: Prisma.ProgramTypeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProgramType>
          }
          groupBy: {
            args: Prisma.ProgramTypeGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProgramTypeGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProgramTypeCountArgs<ExtArgs>
            result: $Utils.Optional<ProgramTypeCountAggregateOutputType> | number
          }
        }
      }
      ActiveProgram: {
        payload: Prisma.$ActiveProgramPayload<ExtArgs>
        fields: Prisma.ActiveProgramFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ActiveProgramFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActiveProgramPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ActiveProgramFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActiveProgramPayload>
          }
          findFirst: {
            args: Prisma.ActiveProgramFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActiveProgramPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ActiveProgramFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActiveProgramPayload>
          }
          findMany: {
            args: Prisma.ActiveProgramFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActiveProgramPayload>[]
          }
          create: {
            args: Prisma.ActiveProgramCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActiveProgramPayload>
          }
          createMany: {
            args: Prisma.ActiveProgramCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ActiveProgramCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActiveProgramPayload>[]
          }
          delete: {
            args: Prisma.ActiveProgramDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActiveProgramPayload>
          }
          update: {
            args: Prisma.ActiveProgramUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActiveProgramPayload>
          }
          deleteMany: {
            args: Prisma.ActiveProgramDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ActiveProgramUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ActiveProgramUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActiveProgramPayload>
          }
          aggregate: {
            args: Prisma.ActiveProgramAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateActiveProgram>
          }
          groupBy: {
            args: Prisma.ActiveProgramGroupByArgs<ExtArgs>
            result: $Utils.Optional<ActiveProgramGroupByOutputType>[]
          }
          count: {
            args: Prisma.ActiveProgramCountArgs<ExtArgs>
            result: $Utils.Optional<ActiveProgramCountAggregateOutputType> | number
          }
        }
      }
      Transaction: {
        payload: Prisma.$TransactionPayload<ExtArgs>
        fields: Prisma.TransactionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TransactionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TransactionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          findFirst: {
            args: Prisma.TransactionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TransactionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          findMany: {
            args: Prisma.TransactionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[]
          }
          create: {
            args: Prisma.TransactionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          createMany: {
            args: Prisma.TransactionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TransactionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[]
          }
          delete: {
            args: Prisma.TransactionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          update: {
            args: Prisma.TransactionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          deleteMany: {
            args: Prisma.TransactionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TransactionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TransactionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          aggregate: {
            args: Prisma.TransactionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTransaction>
          }
          groupBy: {
            args: Prisma.TransactionGroupByArgs<ExtArgs>
            result: $Utils.Optional<TransactionGroupByOutputType>[]
          }
          count: {
            args: Prisma.TransactionCountArgs<ExtArgs>
            result: $Utils.Optional<TransactionCountAggregateOutputType> | number
          }
        }
      }
      Achievement: {
        payload: Prisma.$AchievementPayload<ExtArgs>
        fields: Prisma.AchievementFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AchievementFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AchievementPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AchievementFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AchievementPayload>
          }
          findFirst: {
            args: Prisma.AchievementFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AchievementPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AchievementFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AchievementPayload>
          }
          findMany: {
            args: Prisma.AchievementFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AchievementPayload>[]
          }
          create: {
            args: Prisma.AchievementCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AchievementPayload>
          }
          createMany: {
            args: Prisma.AchievementCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AchievementCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AchievementPayload>[]
          }
          delete: {
            args: Prisma.AchievementDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AchievementPayload>
          }
          update: {
            args: Prisma.AchievementUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AchievementPayload>
          }
          deleteMany: {
            args: Prisma.AchievementDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AchievementUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AchievementUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AchievementPayload>
          }
          aggregate: {
            args: Prisma.AchievementAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAchievement>
          }
          groupBy: {
            args: Prisma.AchievementGroupByArgs<ExtArgs>
            result: $Utils.Optional<AchievementGroupByOutputType>[]
          }
          count: {
            args: Prisma.AchievementCountArgs<ExtArgs>
            result: $Utils.Optional<AchievementCountAggregateOutputType> | number
          }
        }
      }
      UserAchievement: {
        payload: Prisma.$UserAchievementPayload<ExtArgs>
        fields: Prisma.UserAchievementFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserAchievementFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAchievementPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserAchievementFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAchievementPayload>
          }
          findFirst: {
            args: Prisma.UserAchievementFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAchievementPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserAchievementFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAchievementPayload>
          }
          findMany: {
            args: Prisma.UserAchievementFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAchievementPayload>[]
          }
          create: {
            args: Prisma.UserAchievementCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAchievementPayload>
          }
          createMany: {
            args: Prisma.UserAchievementCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserAchievementCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAchievementPayload>[]
          }
          delete: {
            args: Prisma.UserAchievementDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAchievementPayload>
          }
          update: {
            args: Prisma.UserAchievementUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAchievementPayload>
          }
          deleteMany: {
            args: Prisma.UserAchievementDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserAchievementUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserAchievementUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAchievementPayload>
          }
          aggregate: {
            args: Prisma.UserAchievementAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserAchievement>
          }
          groupBy: {
            args: Prisma.UserAchievementGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserAchievementGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserAchievementCountArgs<ExtArgs>
            result: $Utils.Optional<UserAchievementCountAggregateOutputType> | number
          }
        }
      }
      OfflineSession: {
        payload: Prisma.$OfflineSessionPayload<ExtArgs>
        fields: Prisma.OfflineSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OfflineSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OfflineSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OfflineSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OfflineSessionPayload>
          }
          findFirst: {
            args: Prisma.OfflineSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OfflineSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OfflineSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OfflineSessionPayload>
          }
          findMany: {
            args: Prisma.OfflineSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OfflineSessionPayload>[]
          }
          create: {
            args: Prisma.OfflineSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OfflineSessionPayload>
          }
          createMany: {
            args: Prisma.OfflineSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OfflineSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OfflineSessionPayload>[]
          }
          delete: {
            args: Prisma.OfflineSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OfflineSessionPayload>
          }
          update: {
            args: Prisma.OfflineSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OfflineSessionPayload>
          }
          deleteMany: {
            args: Prisma.OfflineSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OfflineSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.OfflineSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OfflineSessionPayload>
          }
          aggregate: {
            args: Prisma.OfflineSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOfflineSession>
          }
          groupBy: {
            args: Prisma.OfflineSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<OfflineSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.OfflineSessionCountArgs<ExtArgs>
            result: $Utils.Optional<OfflineSessionCountAggregateOutputType> | number
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
    ownedItems: number
    activePrograms: number
    transactions: number
    achievements: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ownedItems?: boolean | UserCountOutputTypeCountOwnedItemsArgs
    activePrograms?: boolean | UserCountOutputTypeCountActiveProgramsArgs
    transactions?: boolean | UserCountOutputTypeCountTransactionsArgs
    achievements?: boolean | UserCountOutputTypeCountAchievementsArgs
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
  export type UserCountOutputTypeCountOwnedItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OwnedItemWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountActiveProgramsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ActiveProgramWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTransactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAchievementsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserAchievementWhereInput
  }


  /**
   * Count Type ItemCountOutputType
   */

  export type ItemCountOutputType = {
    ownedItems: number
  }

  export type ItemCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ownedItems?: boolean | ItemCountOutputTypeCountOwnedItemsArgs
  }

  // Custom InputTypes
  /**
   * ItemCountOutputType without action
   */
  export type ItemCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemCountOutputType
     */
    select?: ItemCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ItemCountOutputType without action
   */
  export type ItemCountOutputTypeCountOwnedItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OwnedItemWhereInput
  }


  /**
   * Count Type ProgramTypeCountOutputType
   */

  export type ProgramTypeCountOutputType = {
    activePrograms: number
  }

  export type ProgramTypeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    activePrograms?: boolean | ProgramTypeCountOutputTypeCountActiveProgramsArgs
  }

  // Custom InputTypes
  /**
   * ProgramTypeCountOutputType without action
   */
  export type ProgramTypeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgramTypeCountOutputType
     */
    select?: ProgramTypeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProgramTypeCountOutputType without action
   */
  export type ProgramTypeCountOutputTypeCountActiveProgramsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ActiveProgramWhereInput
  }


  /**
   * Count Type AchievementCountOutputType
   */

  export type AchievementCountOutputType = {
    userAchievements: number
  }

  export type AchievementCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userAchievements?: boolean | AchievementCountOutputTypeCountUserAchievementsArgs
  }

  // Custom InputTypes
  /**
   * AchievementCountOutputType without action
   */
  export type AchievementCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AchievementCountOutputType
     */
    select?: AchievementCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AchievementCountOutputType without action
   */
  export type AchievementCountOutputTypeCountUserAchievementsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserAchievementWhereInput
  }


  /**
   * Models
   */

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
    email: string | null
    username: string | null
    password: string | null
    createdAt: Date | null
    updatedAt: Date | null
    lastLoginAt: Date | null
    lastActiveAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    username: string | null
    password: string | null
    createdAt: Date | null
    updatedAt: Date | null
    lastLoginAt: Date | null
    lastActiveAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    username: number
    password: number
    createdAt: number
    updatedAt: number
    lastLoginAt: number
    lastActiveAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    username?: true
    password?: true
    createdAt?: true
    updatedAt?: true
    lastLoginAt?: true
    lastActiveAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    username?: true
    password?: true
    createdAt?: true
    updatedAt?: true
    lastLoginAt?: true
    lastActiveAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    username?: true
    password?: true
    createdAt?: true
    updatedAt?: true
    lastLoginAt?: true
    lastActiveAt?: true
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
    email: string
    username: string
    password: string
    createdAt: Date
    updatedAt: Date
    lastLoginAt: Date | null
    lastActiveAt: Date | null
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
    email?: boolean
    username?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lastLoginAt?: boolean
    lastActiveAt?: boolean
    progression?: boolean | User$progressionArgs<ExtArgs>
    ownedItems?: boolean | User$ownedItemsArgs<ExtArgs>
    activePrograms?: boolean | User$activeProgramsArgs<ExtArgs>
    transactions?: boolean | User$transactionsArgs<ExtArgs>
    achievements?: boolean | User$achievementsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    username?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lastLoginAt?: boolean
    lastActiveAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    username?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lastLoginAt?: boolean
    lastActiveAt?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    progression?: boolean | User$progressionArgs<ExtArgs>
    ownedItems?: boolean | User$ownedItemsArgs<ExtArgs>
    activePrograms?: boolean | User$activeProgramsArgs<ExtArgs>
    transactions?: boolean | User$transactionsArgs<ExtArgs>
    achievements?: boolean | User$achievementsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      progression: Prisma.$ProgressionPayload<ExtArgs> | null
      ownedItems: Prisma.$OwnedItemPayload<ExtArgs>[]
      activePrograms: Prisma.$ActiveProgramPayload<ExtArgs>[]
      transactions: Prisma.$TransactionPayload<ExtArgs>[]
      achievements: Prisma.$UserAchievementPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      username: string
      password: string
      createdAt: Date
      updatedAt: Date
      lastLoginAt: Date | null
      lastActiveAt: Date | null
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
    progression<T extends User$progressionArgs<ExtArgs> = {}>(args?: Subset<T, User$progressionArgs<ExtArgs>>): Prisma__ProgressionClient<$Result.GetResult<Prisma.$ProgressionPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    ownedItems<T extends User$ownedItemsArgs<ExtArgs> = {}>(args?: Subset<T, User$ownedItemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OwnedItemPayload<ExtArgs>, T, "findMany"> | Null>
    activePrograms<T extends User$activeProgramsArgs<ExtArgs> = {}>(args?: Subset<T, User$activeProgramsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActiveProgramPayload<ExtArgs>, T, "findMany"> | Null>
    transactions<T extends User$transactionsArgs<ExtArgs> = {}>(args?: Subset<T, User$transactionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany"> | Null>
    achievements<T extends User$achievementsArgs<ExtArgs> = {}>(args?: Subset<T, User$achievementsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserAchievementPayload<ExtArgs>, T, "findMany"> | Null>
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
    readonly email: FieldRef<"User", 'String'>
    readonly username: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly lastLoginAt: FieldRef<"User", 'DateTime'>
    readonly lastActiveAt: FieldRef<"User", 'DateTime'>
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
   * User.progression
   */
  export type User$progressionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progression
     */
    select?: ProgressionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressionInclude<ExtArgs> | null
    where?: ProgressionWhereInput
  }

  /**
   * User.ownedItems
   */
  export type User$ownedItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OwnedItem
     */
    select?: OwnedItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OwnedItemInclude<ExtArgs> | null
    where?: OwnedItemWhereInput
    orderBy?: OwnedItemOrderByWithRelationInput | OwnedItemOrderByWithRelationInput[]
    cursor?: OwnedItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OwnedItemScalarFieldEnum | OwnedItemScalarFieldEnum[]
  }

  /**
   * User.activePrograms
   */
  export type User$activeProgramsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActiveProgram
     */
    select?: ActiveProgramSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActiveProgramInclude<ExtArgs> | null
    where?: ActiveProgramWhereInput
    orderBy?: ActiveProgramOrderByWithRelationInput | ActiveProgramOrderByWithRelationInput[]
    cursor?: ActiveProgramWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ActiveProgramScalarFieldEnum | ActiveProgramScalarFieldEnum[]
  }

  /**
   * User.transactions
   */
  export type User$transactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    cursor?: TransactionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * User.achievements
   */
  export type User$achievementsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAchievement
     */
    select?: UserAchievementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAchievementInclude<ExtArgs> | null
    where?: UserAchievementWhereInput
    orderBy?: UserAchievementOrderByWithRelationInput | UserAchievementOrderByWithRelationInput[]
    cursor?: UserAchievementWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserAchievementScalarFieldEnum | UserAchievementScalarFieldEnum[]
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
   * Model Progression
   */

  export type AggregateProgression = {
    _count: ProgressionCountAggregateOutputType | null
    _avg: ProgressionAvgAggregateOutputType | null
    _sum: ProgressionSumAggregateOutputType | null
    _min: ProgressionMinAggregateOutputType | null
    _max: ProgressionMaxAggregateOutputType | null
  }

  export type ProgressionAvgAggregateOutputType = {
    linesOfCode: Decimal | null
    totalLinesWritten: Decimal | null
    clickMultiplier: number | null
    passiveMultiplier: number | null
    criticalChance: number | null
    criticalMultiplier: number | null
    level: number | null
    experience: Decimal | null
    experienceToNext: Decimal | null
    prestigeLevel: number | null
    prestigePoints: Decimal | null
    totalClicks: number | null
    totalPlaytimeSeconds: number | null
  }

  export type ProgressionSumAggregateOutputType = {
    linesOfCode: Decimal | null
    totalLinesWritten: Decimal | null
    clickMultiplier: number | null
    passiveMultiplier: number | null
    criticalChance: number | null
    criticalMultiplier: number | null
    level: number | null
    experience: Decimal | null
    experienceToNext: Decimal | null
    prestigeLevel: number | null
    prestigePoints: Decimal | null
    totalClicks: bigint | null
    totalPlaytimeSeconds: bigint | null
  }

  export type ProgressionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    linesOfCode: Decimal | null
    totalLinesWritten: Decimal | null
    clickMultiplier: number | null
    passiveMultiplier: number | null
    criticalChance: number | null
    criticalMultiplier: number | null
    level: number | null
    experience: Decimal | null
    experienceToNext: Decimal | null
    prestigeLevel: number | null
    prestigePoints: Decimal | null
    totalClicks: bigint | null
    totalPlaytimeSeconds: bigint | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProgressionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    linesOfCode: Decimal | null
    totalLinesWritten: Decimal | null
    clickMultiplier: number | null
    passiveMultiplier: number | null
    criticalChance: number | null
    criticalMultiplier: number | null
    level: number | null
    experience: Decimal | null
    experienceToNext: Decimal | null
    prestigeLevel: number | null
    prestigePoints: Decimal | null
    totalClicks: bigint | null
    totalPlaytimeSeconds: bigint | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProgressionCountAggregateOutputType = {
    id: number
    userId: number
    linesOfCode: number
    totalLinesWritten: number
    clickMultiplier: number
    passiveMultiplier: number
    criticalChance: number
    criticalMultiplier: number
    level: number
    experience: number
    experienceToNext: number
    prestigeLevel: number
    prestigePoints: number
    totalClicks: number
    totalPlaytimeSeconds: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProgressionAvgAggregateInputType = {
    linesOfCode?: true
    totalLinesWritten?: true
    clickMultiplier?: true
    passiveMultiplier?: true
    criticalChance?: true
    criticalMultiplier?: true
    level?: true
    experience?: true
    experienceToNext?: true
    prestigeLevel?: true
    prestigePoints?: true
    totalClicks?: true
    totalPlaytimeSeconds?: true
  }

  export type ProgressionSumAggregateInputType = {
    linesOfCode?: true
    totalLinesWritten?: true
    clickMultiplier?: true
    passiveMultiplier?: true
    criticalChance?: true
    criticalMultiplier?: true
    level?: true
    experience?: true
    experienceToNext?: true
    prestigeLevel?: true
    prestigePoints?: true
    totalClicks?: true
    totalPlaytimeSeconds?: true
  }

  export type ProgressionMinAggregateInputType = {
    id?: true
    userId?: true
    linesOfCode?: true
    totalLinesWritten?: true
    clickMultiplier?: true
    passiveMultiplier?: true
    criticalChance?: true
    criticalMultiplier?: true
    level?: true
    experience?: true
    experienceToNext?: true
    prestigeLevel?: true
    prestigePoints?: true
    totalClicks?: true
    totalPlaytimeSeconds?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProgressionMaxAggregateInputType = {
    id?: true
    userId?: true
    linesOfCode?: true
    totalLinesWritten?: true
    clickMultiplier?: true
    passiveMultiplier?: true
    criticalChance?: true
    criticalMultiplier?: true
    level?: true
    experience?: true
    experienceToNext?: true
    prestigeLevel?: true
    prestigePoints?: true
    totalClicks?: true
    totalPlaytimeSeconds?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProgressionCountAggregateInputType = {
    id?: true
    userId?: true
    linesOfCode?: true
    totalLinesWritten?: true
    clickMultiplier?: true
    passiveMultiplier?: true
    criticalChance?: true
    criticalMultiplier?: true
    level?: true
    experience?: true
    experienceToNext?: true
    prestigeLevel?: true
    prestigePoints?: true
    totalClicks?: true
    totalPlaytimeSeconds?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProgressionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Progression to aggregate.
     */
    where?: ProgressionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Progressions to fetch.
     */
    orderBy?: ProgressionOrderByWithRelationInput | ProgressionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProgressionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Progressions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Progressions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Progressions
    **/
    _count?: true | ProgressionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProgressionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProgressionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProgressionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProgressionMaxAggregateInputType
  }

  export type GetProgressionAggregateType<T extends ProgressionAggregateArgs> = {
        [P in keyof T & keyof AggregateProgression]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProgression[P]>
      : GetScalarType<T[P], AggregateProgression[P]>
  }




  export type ProgressionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProgressionWhereInput
    orderBy?: ProgressionOrderByWithAggregationInput | ProgressionOrderByWithAggregationInput[]
    by: ProgressionScalarFieldEnum[] | ProgressionScalarFieldEnum
    having?: ProgressionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProgressionCountAggregateInputType | true
    _avg?: ProgressionAvgAggregateInputType
    _sum?: ProgressionSumAggregateInputType
    _min?: ProgressionMinAggregateInputType
    _max?: ProgressionMaxAggregateInputType
  }

  export type ProgressionGroupByOutputType = {
    id: string
    userId: string
    linesOfCode: Decimal
    totalLinesWritten: Decimal
    clickMultiplier: number
    passiveMultiplier: number
    criticalChance: number
    criticalMultiplier: number
    level: number
    experience: Decimal
    experienceToNext: Decimal
    prestigeLevel: number
    prestigePoints: Decimal
    totalClicks: bigint
    totalPlaytimeSeconds: bigint
    createdAt: Date
    updatedAt: Date
    _count: ProgressionCountAggregateOutputType | null
    _avg: ProgressionAvgAggregateOutputType | null
    _sum: ProgressionSumAggregateOutputType | null
    _min: ProgressionMinAggregateOutputType | null
    _max: ProgressionMaxAggregateOutputType | null
  }

  type GetProgressionGroupByPayload<T extends ProgressionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProgressionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProgressionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProgressionGroupByOutputType[P]>
            : GetScalarType<T[P], ProgressionGroupByOutputType[P]>
        }
      >
    >


  export type ProgressionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    linesOfCode?: boolean
    totalLinesWritten?: boolean
    clickMultiplier?: boolean
    passiveMultiplier?: boolean
    criticalChance?: boolean
    criticalMultiplier?: boolean
    level?: boolean
    experience?: boolean
    experienceToNext?: boolean
    prestigeLevel?: boolean
    prestigePoints?: boolean
    totalClicks?: boolean
    totalPlaytimeSeconds?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["progression"]>

  export type ProgressionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    linesOfCode?: boolean
    totalLinesWritten?: boolean
    clickMultiplier?: boolean
    passiveMultiplier?: boolean
    criticalChance?: boolean
    criticalMultiplier?: boolean
    level?: boolean
    experience?: boolean
    experienceToNext?: boolean
    prestigeLevel?: boolean
    prestigePoints?: boolean
    totalClicks?: boolean
    totalPlaytimeSeconds?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["progression"]>

  export type ProgressionSelectScalar = {
    id?: boolean
    userId?: boolean
    linesOfCode?: boolean
    totalLinesWritten?: boolean
    clickMultiplier?: boolean
    passiveMultiplier?: boolean
    criticalChance?: boolean
    criticalMultiplier?: boolean
    level?: boolean
    experience?: boolean
    experienceToNext?: boolean
    prestigeLevel?: boolean
    prestigePoints?: boolean
    totalClicks?: boolean
    totalPlaytimeSeconds?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProgressionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ProgressionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ProgressionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Progression"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      linesOfCode: Prisma.Decimal
      totalLinesWritten: Prisma.Decimal
      clickMultiplier: number
      passiveMultiplier: number
      criticalChance: number
      criticalMultiplier: number
      level: number
      experience: Prisma.Decimal
      experienceToNext: Prisma.Decimal
      prestigeLevel: number
      prestigePoints: Prisma.Decimal
      totalClicks: bigint
      totalPlaytimeSeconds: bigint
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["progression"]>
    composites: {}
  }

  type ProgressionGetPayload<S extends boolean | null | undefined | ProgressionDefaultArgs> = $Result.GetResult<Prisma.$ProgressionPayload, S>

  type ProgressionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ProgressionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ProgressionCountAggregateInputType | true
    }

  export interface ProgressionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Progression'], meta: { name: 'Progression' } }
    /**
     * Find zero or one Progression that matches the filter.
     * @param {ProgressionFindUniqueArgs} args - Arguments to find a Progression
     * @example
     * // Get one Progression
     * const progression = await prisma.progression.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProgressionFindUniqueArgs>(args: SelectSubset<T, ProgressionFindUniqueArgs<ExtArgs>>): Prisma__ProgressionClient<$Result.GetResult<Prisma.$ProgressionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Progression that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ProgressionFindUniqueOrThrowArgs} args - Arguments to find a Progression
     * @example
     * // Get one Progression
     * const progression = await prisma.progression.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProgressionFindUniqueOrThrowArgs>(args: SelectSubset<T, ProgressionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProgressionClient<$Result.GetResult<Prisma.$ProgressionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Progression that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgressionFindFirstArgs} args - Arguments to find a Progression
     * @example
     * // Get one Progression
     * const progression = await prisma.progression.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProgressionFindFirstArgs>(args?: SelectSubset<T, ProgressionFindFirstArgs<ExtArgs>>): Prisma__ProgressionClient<$Result.GetResult<Prisma.$ProgressionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Progression that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgressionFindFirstOrThrowArgs} args - Arguments to find a Progression
     * @example
     * // Get one Progression
     * const progression = await prisma.progression.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProgressionFindFirstOrThrowArgs>(args?: SelectSubset<T, ProgressionFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProgressionClient<$Result.GetResult<Prisma.$ProgressionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Progressions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgressionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Progressions
     * const progressions = await prisma.progression.findMany()
     * 
     * // Get first 10 Progressions
     * const progressions = await prisma.progression.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const progressionWithIdOnly = await prisma.progression.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProgressionFindManyArgs>(args?: SelectSubset<T, ProgressionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProgressionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Progression.
     * @param {ProgressionCreateArgs} args - Arguments to create a Progression.
     * @example
     * // Create one Progression
     * const Progression = await prisma.progression.create({
     *   data: {
     *     // ... data to create a Progression
     *   }
     * })
     * 
     */
    create<T extends ProgressionCreateArgs>(args: SelectSubset<T, ProgressionCreateArgs<ExtArgs>>): Prisma__ProgressionClient<$Result.GetResult<Prisma.$ProgressionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Progressions.
     * @param {ProgressionCreateManyArgs} args - Arguments to create many Progressions.
     * @example
     * // Create many Progressions
     * const progression = await prisma.progression.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProgressionCreateManyArgs>(args?: SelectSubset<T, ProgressionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Progressions and returns the data saved in the database.
     * @param {ProgressionCreateManyAndReturnArgs} args - Arguments to create many Progressions.
     * @example
     * // Create many Progressions
     * const progression = await prisma.progression.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Progressions and only return the `id`
     * const progressionWithIdOnly = await prisma.progression.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProgressionCreateManyAndReturnArgs>(args?: SelectSubset<T, ProgressionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProgressionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Progression.
     * @param {ProgressionDeleteArgs} args - Arguments to delete one Progression.
     * @example
     * // Delete one Progression
     * const Progression = await prisma.progression.delete({
     *   where: {
     *     // ... filter to delete one Progression
     *   }
     * })
     * 
     */
    delete<T extends ProgressionDeleteArgs>(args: SelectSubset<T, ProgressionDeleteArgs<ExtArgs>>): Prisma__ProgressionClient<$Result.GetResult<Prisma.$ProgressionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Progression.
     * @param {ProgressionUpdateArgs} args - Arguments to update one Progression.
     * @example
     * // Update one Progression
     * const progression = await prisma.progression.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProgressionUpdateArgs>(args: SelectSubset<T, ProgressionUpdateArgs<ExtArgs>>): Prisma__ProgressionClient<$Result.GetResult<Prisma.$ProgressionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Progressions.
     * @param {ProgressionDeleteManyArgs} args - Arguments to filter Progressions to delete.
     * @example
     * // Delete a few Progressions
     * const { count } = await prisma.progression.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProgressionDeleteManyArgs>(args?: SelectSubset<T, ProgressionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Progressions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgressionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Progressions
     * const progression = await prisma.progression.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProgressionUpdateManyArgs>(args: SelectSubset<T, ProgressionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Progression.
     * @param {ProgressionUpsertArgs} args - Arguments to update or create a Progression.
     * @example
     * // Update or create a Progression
     * const progression = await prisma.progression.upsert({
     *   create: {
     *     // ... data to create a Progression
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Progression we want to update
     *   }
     * })
     */
    upsert<T extends ProgressionUpsertArgs>(args: SelectSubset<T, ProgressionUpsertArgs<ExtArgs>>): Prisma__ProgressionClient<$Result.GetResult<Prisma.$ProgressionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Progressions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgressionCountArgs} args - Arguments to filter Progressions to count.
     * @example
     * // Count the number of Progressions
     * const count = await prisma.progression.count({
     *   where: {
     *     // ... the filter for the Progressions we want to count
     *   }
     * })
    **/
    count<T extends ProgressionCountArgs>(
      args?: Subset<T, ProgressionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProgressionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Progression.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgressionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProgressionAggregateArgs>(args: Subset<T, ProgressionAggregateArgs>): Prisma.PrismaPromise<GetProgressionAggregateType<T>>

    /**
     * Group by Progression.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgressionGroupByArgs} args - Group by arguments.
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
      T extends ProgressionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProgressionGroupByArgs['orderBy'] }
        : { orderBy?: ProgressionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ProgressionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProgressionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Progression model
   */
  readonly fields: ProgressionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Progression.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProgressionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the Progression model
   */ 
  interface ProgressionFieldRefs {
    readonly id: FieldRef<"Progression", 'String'>
    readonly userId: FieldRef<"Progression", 'String'>
    readonly linesOfCode: FieldRef<"Progression", 'Decimal'>
    readonly totalLinesWritten: FieldRef<"Progression", 'Decimal'>
    readonly clickMultiplier: FieldRef<"Progression", 'Float'>
    readonly passiveMultiplier: FieldRef<"Progression", 'Float'>
    readonly criticalChance: FieldRef<"Progression", 'Float'>
    readonly criticalMultiplier: FieldRef<"Progression", 'Float'>
    readonly level: FieldRef<"Progression", 'Int'>
    readonly experience: FieldRef<"Progression", 'Decimal'>
    readonly experienceToNext: FieldRef<"Progression", 'Decimal'>
    readonly prestigeLevel: FieldRef<"Progression", 'Int'>
    readonly prestigePoints: FieldRef<"Progression", 'Decimal'>
    readonly totalClicks: FieldRef<"Progression", 'BigInt'>
    readonly totalPlaytimeSeconds: FieldRef<"Progression", 'BigInt'>
    readonly createdAt: FieldRef<"Progression", 'DateTime'>
    readonly updatedAt: FieldRef<"Progression", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Progression findUnique
   */
  export type ProgressionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progression
     */
    select?: ProgressionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressionInclude<ExtArgs> | null
    /**
     * Filter, which Progression to fetch.
     */
    where: ProgressionWhereUniqueInput
  }

  /**
   * Progression findUniqueOrThrow
   */
  export type ProgressionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progression
     */
    select?: ProgressionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressionInclude<ExtArgs> | null
    /**
     * Filter, which Progression to fetch.
     */
    where: ProgressionWhereUniqueInput
  }

  /**
   * Progression findFirst
   */
  export type ProgressionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progression
     */
    select?: ProgressionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressionInclude<ExtArgs> | null
    /**
     * Filter, which Progression to fetch.
     */
    where?: ProgressionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Progressions to fetch.
     */
    orderBy?: ProgressionOrderByWithRelationInput | ProgressionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Progressions.
     */
    cursor?: ProgressionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Progressions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Progressions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Progressions.
     */
    distinct?: ProgressionScalarFieldEnum | ProgressionScalarFieldEnum[]
  }

  /**
   * Progression findFirstOrThrow
   */
  export type ProgressionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progression
     */
    select?: ProgressionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressionInclude<ExtArgs> | null
    /**
     * Filter, which Progression to fetch.
     */
    where?: ProgressionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Progressions to fetch.
     */
    orderBy?: ProgressionOrderByWithRelationInput | ProgressionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Progressions.
     */
    cursor?: ProgressionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Progressions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Progressions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Progressions.
     */
    distinct?: ProgressionScalarFieldEnum | ProgressionScalarFieldEnum[]
  }

  /**
   * Progression findMany
   */
  export type ProgressionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progression
     */
    select?: ProgressionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressionInclude<ExtArgs> | null
    /**
     * Filter, which Progressions to fetch.
     */
    where?: ProgressionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Progressions to fetch.
     */
    orderBy?: ProgressionOrderByWithRelationInput | ProgressionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Progressions.
     */
    cursor?: ProgressionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Progressions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Progressions.
     */
    skip?: number
    distinct?: ProgressionScalarFieldEnum | ProgressionScalarFieldEnum[]
  }

  /**
   * Progression create
   */
  export type ProgressionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progression
     */
    select?: ProgressionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressionInclude<ExtArgs> | null
    /**
     * The data needed to create a Progression.
     */
    data: XOR<ProgressionCreateInput, ProgressionUncheckedCreateInput>
  }

  /**
   * Progression createMany
   */
  export type ProgressionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Progressions.
     */
    data: ProgressionCreateManyInput | ProgressionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Progression createManyAndReturn
   */
  export type ProgressionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progression
     */
    select?: ProgressionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Progressions.
     */
    data: ProgressionCreateManyInput | ProgressionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Progression update
   */
  export type ProgressionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progression
     */
    select?: ProgressionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressionInclude<ExtArgs> | null
    /**
     * The data needed to update a Progression.
     */
    data: XOR<ProgressionUpdateInput, ProgressionUncheckedUpdateInput>
    /**
     * Choose, which Progression to update.
     */
    where: ProgressionWhereUniqueInput
  }

  /**
   * Progression updateMany
   */
  export type ProgressionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Progressions.
     */
    data: XOR<ProgressionUpdateManyMutationInput, ProgressionUncheckedUpdateManyInput>
    /**
     * Filter which Progressions to update
     */
    where?: ProgressionWhereInput
  }

  /**
   * Progression upsert
   */
  export type ProgressionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progression
     */
    select?: ProgressionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressionInclude<ExtArgs> | null
    /**
     * The filter to search for the Progression to update in case it exists.
     */
    where: ProgressionWhereUniqueInput
    /**
     * In case the Progression found by the `where` argument doesn't exist, create a new Progression with this data.
     */
    create: XOR<ProgressionCreateInput, ProgressionUncheckedCreateInput>
    /**
     * In case the Progression was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProgressionUpdateInput, ProgressionUncheckedUpdateInput>
  }

  /**
   * Progression delete
   */
  export type ProgressionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progression
     */
    select?: ProgressionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressionInclude<ExtArgs> | null
    /**
     * Filter which Progression to delete.
     */
    where: ProgressionWhereUniqueInput
  }

  /**
   * Progression deleteMany
   */
  export type ProgressionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Progressions to delete
     */
    where?: ProgressionWhereInput
  }

  /**
   * Progression without action
   */
  export type ProgressionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progression
     */
    select?: ProgressionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressionInclude<ExtArgs> | null
  }


  /**
   * Model Item
   */

  export type AggregateItem = {
    _count: ItemCountAggregateOutputType | null
    _avg: ItemAvgAggregateOutputType | null
    _sum: ItemSumAggregateOutputType | null
    _min: ItemMinAggregateOutputType | null
    _max: ItemMaxAggregateOutputType | null
  }

  export type ItemAvgAggregateOutputType = {
    baseCost: Decimal | null
    baseEffect: number | null
    costMultiplier: number | null
    maxQuantity: number | null
    unlockLevel: number | null
  }

  export type ItemSumAggregateOutputType = {
    baseCost: Decimal | null
    baseEffect: number | null
    costMultiplier: number | null
    maxQuantity: number | null
    unlockLevel: number | null
  }

  export type ItemMinAggregateOutputType = {
    id: string | null
    slug: string | null
    name: string | null
    description: string | null
    category: $Enums.ItemCategory | null
    baseCost: Decimal | null
    baseEffect: number | null
    effectType: $Enums.EffectType | null
    costMultiplier: number | null
    maxQuantity: number | null
    unlockLevel: number | null
    unlockItemSlug: string | null
    iconUrl: string | null
    rarity: $Enums.Rarity | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ItemMaxAggregateOutputType = {
    id: string | null
    slug: string | null
    name: string | null
    description: string | null
    category: $Enums.ItemCategory | null
    baseCost: Decimal | null
    baseEffect: number | null
    effectType: $Enums.EffectType | null
    costMultiplier: number | null
    maxQuantity: number | null
    unlockLevel: number | null
    unlockItemSlug: string | null
    iconUrl: string | null
    rarity: $Enums.Rarity | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ItemCountAggregateOutputType = {
    id: number
    slug: number
    name: number
    description: number
    category: number
    baseCost: number
    baseEffect: number
    effectType: number
    costMultiplier: number
    maxQuantity: number
    unlockLevel: number
    unlockItemSlug: number
    iconUrl: number
    rarity: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ItemAvgAggregateInputType = {
    baseCost?: true
    baseEffect?: true
    costMultiplier?: true
    maxQuantity?: true
    unlockLevel?: true
  }

  export type ItemSumAggregateInputType = {
    baseCost?: true
    baseEffect?: true
    costMultiplier?: true
    maxQuantity?: true
    unlockLevel?: true
  }

  export type ItemMinAggregateInputType = {
    id?: true
    slug?: true
    name?: true
    description?: true
    category?: true
    baseCost?: true
    baseEffect?: true
    effectType?: true
    costMultiplier?: true
    maxQuantity?: true
    unlockLevel?: true
    unlockItemSlug?: true
    iconUrl?: true
    rarity?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ItemMaxAggregateInputType = {
    id?: true
    slug?: true
    name?: true
    description?: true
    category?: true
    baseCost?: true
    baseEffect?: true
    effectType?: true
    costMultiplier?: true
    maxQuantity?: true
    unlockLevel?: true
    unlockItemSlug?: true
    iconUrl?: true
    rarity?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ItemCountAggregateInputType = {
    id?: true
    slug?: true
    name?: true
    description?: true
    category?: true
    baseCost?: true
    baseEffect?: true
    effectType?: true
    costMultiplier?: true
    maxQuantity?: true
    unlockLevel?: true
    unlockItemSlug?: true
    iconUrl?: true
    rarity?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Item to aggregate.
     */
    where?: ItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Items to fetch.
     */
    orderBy?: ItemOrderByWithRelationInput | ItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Items from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Items.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Items
    **/
    _count?: true | ItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ItemMaxAggregateInputType
  }

  export type GetItemAggregateType<T extends ItemAggregateArgs> = {
        [P in keyof T & keyof AggregateItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateItem[P]>
      : GetScalarType<T[P], AggregateItem[P]>
  }




  export type ItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ItemWhereInput
    orderBy?: ItemOrderByWithAggregationInput | ItemOrderByWithAggregationInput[]
    by: ItemScalarFieldEnum[] | ItemScalarFieldEnum
    having?: ItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ItemCountAggregateInputType | true
    _avg?: ItemAvgAggregateInputType
    _sum?: ItemSumAggregateInputType
    _min?: ItemMinAggregateInputType
    _max?: ItemMaxAggregateInputType
  }

  export type ItemGroupByOutputType = {
    id: string
    slug: string
    name: string
    description: string
    category: $Enums.ItemCategory
    baseCost: Decimal
    baseEffect: number
    effectType: $Enums.EffectType
    costMultiplier: number
    maxQuantity: number | null
    unlockLevel: number
    unlockItemSlug: string | null
    iconUrl: string | null
    rarity: $Enums.Rarity
    createdAt: Date
    updatedAt: Date
    _count: ItemCountAggregateOutputType | null
    _avg: ItemAvgAggregateOutputType | null
    _sum: ItemSumAggregateOutputType | null
    _min: ItemMinAggregateOutputType | null
    _max: ItemMaxAggregateOutputType | null
  }

  type GetItemGroupByPayload<T extends ItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ItemGroupByOutputType[P]>
            : GetScalarType<T[P], ItemGroupByOutputType[P]>
        }
      >
    >


  export type ItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    name?: boolean
    description?: boolean
    category?: boolean
    baseCost?: boolean
    baseEffect?: boolean
    effectType?: boolean
    costMultiplier?: boolean
    maxQuantity?: boolean
    unlockLevel?: boolean
    unlockItemSlug?: boolean
    iconUrl?: boolean
    rarity?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ownedItems?: boolean | Item$ownedItemsArgs<ExtArgs>
    _count?: boolean | ItemCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["item"]>

  export type ItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    name?: boolean
    description?: boolean
    category?: boolean
    baseCost?: boolean
    baseEffect?: boolean
    effectType?: boolean
    costMultiplier?: boolean
    maxQuantity?: boolean
    unlockLevel?: boolean
    unlockItemSlug?: boolean
    iconUrl?: boolean
    rarity?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["item"]>

  export type ItemSelectScalar = {
    id?: boolean
    slug?: boolean
    name?: boolean
    description?: boolean
    category?: boolean
    baseCost?: boolean
    baseEffect?: boolean
    effectType?: boolean
    costMultiplier?: boolean
    maxQuantity?: boolean
    unlockLevel?: boolean
    unlockItemSlug?: boolean
    iconUrl?: boolean
    rarity?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ownedItems?: boolean | Item$ownedItemsArgs<ExtArgs>
    _count?: boolean | ItemCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Item"
    objects: {
      ownedItems: Prisma.$OwnedItemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      slug: string
      name: string
      description: string
      category: $Enums.ItemCategory
      baseCost: Prisma.Decimal
      baseEffect: number
      effectType: $Enums.EffectType
      costMultiplier: number
      maxQuantity: number | null
      unlockLevel: number
      unlockItemSlug: string | null
      iconUrl: string | null
      rarity: $Enums.Rarity
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["item"]>
    composites: {}
  }

  type ItemGetPayload<S extends boolean | null | undefined | ItemDefaultArgs> = $Result.GetResult<Prisma.$ItemPayload, S>

  type ItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ItemFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ItemCountAggregateInputType | true
    }

  export interface ItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Item'], meta: { name: 'Item' } }
    /**
     * Find zero or one Item that matches the filter.
     * @param {ItemFindUniqueArgs} args - Arguments to find a Item
     * @example
     * // Get one Item
     * const item = await prisma.item.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ItemFindUniqueArgs>(args: SelectSubset<T, ItemFindUniqueArgs<ExtArgs>>): Prisma__ItemClient<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Item that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ItemFindUniqueOrThrowArgs} args - Arguments to find a Item
     * @example
     * // Get one Item
     * const item = await prisma.item.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ItemFindUniqueOrThrowArgs>(args: SelectSubset<T, ItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ItemClient<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Item that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemFindFirstArgs} args - Arguments to find a Item
     * @example
     * // Get one Item
     * const item = await prisma.item.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ItemFindFirstArgs>(args?: SelectSubset<T, ItemFindFirstArgs<ExtArgs>>): Prisma__ItemClient<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Item that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemFindFirstOrThrowArgs} args - Arguments to find a Item
     * @example
     * // Get one Item
     * const item = await prisma.item.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ItemFindFirstOrThrowArgs>(args?: SelectSubset<T, ItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__ItemClient<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Items that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Items
     * const items = await prisma.item.findMany()
     * 
     * // Get first 10 Items
     * const items = await prisma.item.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const itemWithIdOnly = await prisma.item.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ItemFindManyArgs>(args?: SelectSubset<T, ItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Item.
     * @param {ItemCreateArgs} args - Arguments to create a Item.
     * @example
     * // Create one Item
     * const Item = await prisma.item.create({
     *   data: {
     *     // ... data to create a Item
     *   }
     * })
     * 
     */
    create<T extends ItemCreateArgs>(args: SelectSubset<T, ItemCreateArgs<ExtArgs>>): Prisma__ItemClient<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Items.
     * @param {ItemCreateManyArgs} args - Arguments to create many Items.
     * @example
     * // Create many Items
     * const item = await prisma.item.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ItemCreateManyArgs>(args?: SelectSubset<T, ItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Items and returns the data saved in the database.
     * @param {ItemCreateManyAndReturnArgs} args - Arguments to create many Items.
     * @example
     * // Create many Items
     * const item = await prisma.item.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Items and only return the `id`
     * const itemWithIdOnly = await prisma.item.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ItemCreateManyAndReturnArgs>(args?: SelectSubset<T, ItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Item.
     * @param {ItemDeleteArgs} args - Arguments to delete one Item.
     * @example
     * // Delete one Item
     * const Item = await prisma.item.delete({
     *   where: {
     *     // ... filter to delete one Item
     *   }
     * })
     * 
     */
    delete<T extends ItemDeleteArgs>(args: SelectSubset<T, ItemDeleteArgs<ExtArgs>>): Prisma__ItemClient<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Item.
     * @param {ItemUpdateArgs} args - Arguments to update one Item.
     * @example
     * // Update one Item
     * const item = await prisma.item.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ItemUpdateArgs>(args: SelectSubset<T, ItemUpdateArgs<ExtArgs>>): Prisma__ItemClient<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Items.
     * @param {ItemDeleteManyArgs} args - Arguments to filter Items to delete.
     * @example
     * // Delete a few Items
     * const { count } = await prisma.item.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ItemDeleteManyArgs>(args?: SelectSubset<T, ItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Items.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Items
     * const item = await prisma.item.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ItemUpdateManyArgs>(args: SelectSubset<T, ItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Item.
     * @param {ItemUpsertArgs} args - Arguments to update or create a Item.
     * @example
     * // Update or create a Item
     * const item = await prisma.item.upsert({
     *   create: {
     *     // ... data to create a Item
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Item we want to update
     *   }
     * })
     */
    upsert<T extends ItemUpsertArgs>(args: SelectSubset<T, ItemUpsertArgs<ExtArgs>>): Prisma__ItemClient<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Items.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemCountArgs} args - Arguments to filter Items to count.
     * @example
     * // Count the number of Items
     * const count = await prisma.item.count({
     *   where: {
     *     // ... the filter for the Items we want to count
     *   }
     * })
    **/
    count<T extends ItemCountArgs>(
      args?: Subset<T, ItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Item.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ItemAggregateArgs>(args: Subset<T, ItemAggregateArgs>): Prisma.PrismaPromise<GetItemAggregateType<T>>

    /**
     * Group by Item.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemGroupByArgs} args - Group by arguments.
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
      T extends ItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ItemGroupByArgs['orderBy'] }
        : { orderBy?: ItemGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Item model
   */
  readonly fields: ItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Item.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    ownedItems<T extends Item$ownedItemsArgs<ExtArgs> = {}>(args?: Subset<T, Item$ownedItemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OwnedItemPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the Item model
   */ 
  interface ItemFieldRefs {
    readonly id: FieldRef<"Item", 'String'>
    readonly slug: FieldRef<"Item", 'String'>
    readonly name: FieldRef<"Item", 'String'>
    readonly description: FieldRef<"Item", 'String'>
    readonly category: FieldRef<"Item", 'ItemCategory'>
    readonly baseCost: FieldRef<"Item", 'Decimal'>
    readonly baseEffect: FieldRef<"Item", 'Float'>
    readonly effectType: FieldRef<"Item", 'EffectType'>
    readonly costMultiplier: FieldRef<"Item", 'Float'>
    readonly maxQuantity: FieldRef<"Item", 'Int'>
    readonly unlockLevel: FieldRef<"Item", 'Int'>
    readonly unlockItemSlug: FieldRef<"Item", 'String'>
    readonly iconUrl: FieldRef<"Item", 'String'>
    readonly rarity: FieldRef<"Item", 'Rarity'>
    readonly createdAt: FieldRef<"Item", 'DateTime'>
    readonly updatedAt: FieldRef<"Item", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Item findUnique
   */
  export type ItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
    /**
     * Filter, which Item to fetch.
     */
    where: ItemWhereUniqueInput
  }

  /**
   * Item findUniqueOrThrow
   */
  export type ItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
    /**
     * Filter, which Item to fetch.
     */
    where: ItemWhereUniqueInput
  }

  /**
   * Item findFirst
   */
  export type ItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
    /**
     * Filter, which Item to fetch.
     */
    where?: ItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Items to fetch.
     */
    orderBy?: ItemOrderByWithRelationInput | ItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Items.
     */
    cursor?: ItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Items from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Items.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Items.
     */
    distinct?: ItemScalarFieldEnum | ItemScalarFieldEnum[]
  }

  /**
   * Item findFirstOrThrow
   */
  export type ItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
    /**
     * Filter, which Item to fetch.
     */
    where?: ItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Items to fetch.
     */
    orderBy?: ItemOrderByWithRelationInput | ItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Items.
     */
    cursor?: ItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Items from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Items.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Items.
     */
    distinct?: ItemScalarFieldEnum | ItemScalarFieldEnum[]
  }

  /**
   * Item findMany
   */
  export type ItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
    /**
     * Filter, which Items to fetch.
     */
    where?: ItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Items to fetch.
     */
    orderBy?: ItemOrderByWithRelationInput | ItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Items.
     */
    cursor?: ItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Items from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Items.
     */
    skip?: number
    distinct?: ItemScalarFieldEnum | ItemScalarFieldEnum[]
  }

  /**
   * Item create
   */
  export type ItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
    /**
     * The data needed to create a Item.
     */
    data: XOR<ItemCreateInput, ItemUncheckedCreateInput>
  }

  /**
   * Item createMany
   */
  export type ItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Items.
     */
    data: ItemCreateManyInput | ItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Item createManyAndReturn
   */
  export type ItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Items.
     */
    data: ItemCreateManyInput | ItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Item update
   */
  export type ItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
    /**
     * The data needed to update a Item.
     */
    data: XOR<ItemUpdateInput, ItemUncheckedUpdateInput>
    /**
     * Choose, which Item to update.
     */
    where: ItemWhereUniqueInput
  }

  /**
   * Item updateMany
   */
  export type ItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Items.
     */
    data: XOR<ItemUpdateManyMutationInput, ItemUncheckedUpdateManyInput>
    /**
     * Filter which Items to update
     */
    where?: ItemWhereInput
  }

  /**
   * Item upsert
   */
  export type ItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
    /**
     * The filter to search for the Item to update in case it exists.
     */
    where: ItemWhereUniqueInput
    /**
     * In case the Item found by the `where` argument doesn't exist, create a new Item with this data.
     */
    create: XOR<ItemCreateInput, ItemUncheckedCreateInput>
    /**
     * In case the Item was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ItemUpdateInput, ItemUncheckedUpdateInput>
  }

  /**
   * Item delete
   */
  export type ItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
    /**
     * Filter which Item to delete.
     */
    where: ItemWhereUniqueInput
  }

  /**
   * Item deleteMany
   */
  export type ItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Items to delete
     */
    where?: ItemWhereInput
  }

  /**
   * Item.ownedItems
   */
  export type Item$ownedItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OwnedItem
     */
    select?: OwnedItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OwnedItemInclude<ExtArgs> | null
    where?: OwnedItemWhereInput
    orderBy?: OwnedItemOrderByWithRelationInput | OwnedItemOrderByWithRelationInput[]
    cursor?: OwnedItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OwnedItemScalarFieldEnum | OwnedItemScalarFieldEnum[]
  }

  /**
   * Item without action
   */
  export type ItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Item
     */
    select?: ItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemInclude<ExtArgs> | null
  }


  /**
   * Model OwnedItem
   */

  export type AggregateOwnedItem = {
    _count: OwnedItemCountAggregateOutputType | null
    _avg: OwnedItemAvgAggregateOutputType | null
    _sum: OwnedItemSumAggregateOutputType | null
    _min: OwnedItemMinAggregateOutputType | null
    _max: OwnedItemMaxAggregateOutputType | null
  }

  export type OwnedItemAvgAggregateOutputType = {
    quantity: number | null
    level: number | null
  }

  export type OwnedItemSumAggregateOutputType = {
    quantity: number | null
    level: number | null
  }

  export type OwnedItemMinAggregateOutputType = {
    id: string | null
    userId: string | null
    itemId: string | null
    quantity: number | null
    level: number | null
    purchasedAt: Date | null
    updatedAt: Date | null
  }

  export type OwnedItemMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    itemId: string | null
    quantity: number | null
    level: number | null
    purchasedAt: Date | null
    updatedAt: Date | null
  }

  export type OwnedItemCountAggregateOutputType = {
    id: number
    userId: number
    itemId: number
    quantity: number
    level: number
    purchasedAt: number
    updatedAt: number
    _all: number
  }


  export type OwnedItemAvgAggregateInputType = {
    quantity?: true
    level?: true
  }

  export type OwnedItemSumAggregateInputType = {
    quantity?: true
    level?: true
  }

  export type OwnedItemMinAggregateInputType = {
    id?: true
    userId?: true
    itemId?: true
    quantity?: true
    level?: true
    purchasedAt?: true
    updatedAt?: true
  }

  export type OwnedItemMaxAggregateInputType = {
    id?: true
    userId?: true
    itemId?: true
    quantity?: true
    level?: true
    purchasedAt?: true
    updatedAt?: true
  }

  export type OwnedItemCountAggregateInputType = {
    id?: true
    userId?: true
    itemId?: true
    quantity?: true
    level?: true
    purchasedAt?: true
    updatedAt?: true
    _all?: true
  }

  export type OwnedItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OwnedItem to aggregate.
     */
    where?: OwnedItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OwnedItems to fetch.
     */
    orderBy?: OwnedItemOrderByWithRelationInput | OwnedItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OwnedItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OwnedItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OwnedItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OwnedItems
    **/
    _count?: true | OwnedItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OwnedItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OwnedItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OwnedItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OwnedItemMaxAggregateInputType
  }

  export type GetOwnedItemAggregateType<T extends OwnedItemAggregateArgs> = {
        [P in keyof T & keyof AggregateOwnedItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOwnedItem[P]>
      : GetScalarType<T[P], AggregateOwnedItem[P]>
  }




  export type OwnedItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OwnedItemWhereInput
    orderBy?: OwnedItemOrderByWithAggregationInput | OwnedItemOrderByWithAggregationInput[]
    by: OwnedItemScalarFieldEnum[] | OwnedItemScalarFieldEnum
    having?: OwnedItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OwnedItemCountAggregateInputType | true
    _avg?: OwnedItemAvgAggregateInputType
    _sum?: OwnedItemSumAggregateInputType
    _min?: OwnedItemMinAggregateInputType
    _max?: OwnedItemMaxAggregateInputType
  }

  export type OwnedItemGroupByOutputType = {
    id: string
    userId: string
    itemId: string
    quantity: number
    level: number
    purchasedAt: Date
    updatedAt: Date
    _count: OwnedItemCountAggregateOutputType | null
    _avg: OwnedItemAvgAggregateOutputType | null
    _sum: OwnedItemSumAggregateOutputType | null
    _min: OwnedItemMinAggregateOutputType | null
    _max: OwnedItemMaxAggregateOutputType | null
  }

  type GetOwnedItemGroupByPayload<T extends OwnedItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OwnedItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OwnedItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OwnedItemGroupByOutputType[P]>
            : GetScalarType<T[P], OwnedItemGroupByOutputType[P]>
        }
      >
    >


  export type OwnedItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    itemId?: boolean
    quantity?: boolean
    level?: boolean
    purchasedAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    item?: boolean | ItemDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ownedItem"]>

  export type OwnedItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    itemId?: boolean
    quantity?: boolean
    level?: boolean
    purchasedAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    item?: boolean | ItemDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ownedItem"]>

  export type OwnedItemSelectScalar = {
    id?: boolean
    userId?: boolean
    itemId?: boolean
    quantity?: boolean
    level?: boolean
    purchasedAt?: boolean
    updatedAt?: boolean
  }

  export type OwnedItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    item?: boolean | ItemDefaultArgs<ExtArgs>
  }
  export type OwnedItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    item?: boolean | ItemDefaultArgs<ExtArgs>
  }

  export type $OwnedItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OwnedItem"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      item: Prisma.$ItemPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      itemId: string
      quantity: number
      level: number
      purchasedAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["ownedItem"]>
    composites: {}
  }

  type OwnedItemGetPayload<S extends boolean | null | undefined | OwnedItemDefaultArgs> = $Result.GetResult<Prisma.$OwnedItemPayload, S>

  type OwnedItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<OwnedItemFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: OwnedItemCountAggregateInputType | true
    }

  export interface OwnedItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OwnedItem'], meta: { name: 'OwnedItem' } }
    /**
     * Find zero or one OwnedItem that matches the filter.
     * @param {OwnedItemFindUniqueArgs} args - Arguments to find a OwnedItem
     * @example
     * // Get one OwnedItem
     * const ownedItem = await prisma.ownedItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OwnedItemFindUniqueArgs>(args: SelectSubset<T, OwnedItemFindUniqueArgs<ExtArgs>>): Prisma__OwnedItemClient<$Result.GetResult<Prisma.$OwnedItemPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one OwnedItem that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {OwnedItemFindUniqueOrThrowArgs} args - Arguments to find a OwnedItem
     * @example
     * // Get one OwnedItem
     * const ownedItem = await prisma.ownedItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OwnedItemFindUniqueOrThrowArgs>(args: SelectSubset<T, OwnedItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OwnedItemClient<$Result.GetResult<Prisma.$OwnedItemPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first OwnedItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OwnedItemFindFirstArgs} args - Arguments to find a OwnedItem
     * @example
     * // Get one OwnedItem
     * const ownedItem = await prisma.ownedItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OwnedItemFindFirstArgs>(args?: SelectSubset<T, OwnedItemFindFirstArgs<ExtArgs>>): Prisma__OwnedItemClient<$Result.GetResult<Prisma.$OwnedItemPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first OwnedItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OwnedItemFindFirstOrThrowArgs} args - Arguments to find a OwnedItem
     * @example
     * // Get one OwnedItem
     * const ownedItem = await prisma.ownedItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OwnedItemFindFirstOrThrowArgs>(args?: SelectSubset<T, OwnedItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__OwnedItemClient<$Result.GetResult<Prisma.$OwnedItemPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more OwnedItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OwnedItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OwnedItems
     * const ownedItems = await prisma.ownedItem.findMany()
     * 
     * // Get first 10 OwnedItems
     * const ownedItems = await prisma.ownedItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ownedItemWithIdOnly = await prisma.ownedItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OwnedItemFindManyArgs>(args?: SelectSubset<T, OwnedItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OwnedItemPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a OwnedItem.
     * @param {OwnedItemCreateArgs} args - Arguments to create a OwnedItem.
     * @example
     * // Create one OwnedItem
     * const OwnedItem = await prisma.ownedItem.create({
     *   data: {
     *     // ... data to create a OwnedItem
     *   }
     * })
     * 
     */
    create<T extends OwnedItemCreateArgs>(args: SelectSubset<T, OwnedItemCreateArgs<ExtArgs>>): Prisma__OwnedItemClient<$Result.GetResult<Prisma.$OwnedItemPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many OwnedItems.
     * @param {OwnedItemCreateManyArgs} args - Arguments to create many OwnedItems.
     * @example
     * // Create many OwnedItems
     * const ownedItem = await prisma.ownedItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OwnedItemCreateManyArgs>(args?: SelectSubset<T, OwnedItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OwnedItems and returns the data saved in the database.
     * @param {OwnedItemCreateManyAndReturnArgs} args - Arguments to create many OwnedItems.
     * @example
     * // Create many OwnedItems
     * const ownedItem = await prisma.ownedItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OwnedItems and only return the `id`
     * const ownedItemWithIdOnly = await prisma.ownedItem.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OwnedItemCreateManyAndReturnArgs>(args?: SelectSubset<T, OwnedItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OwnedItemPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a OwnedItem.
     * @param {OwnedItemDeleteArgs} args - Arguments to delete one OwnedItem.
     * @example
     * // Delete one OwnedItem
     * const OwnedItem = await prisma.ownedItem.delete({
     *   where: {
     *     // ... filter to delete one OwnedItem
     *   }
     * })
     * 
     */
    delete<T extends OwnedItemDeleteArgs>(args: SelectSubset<T, OwnedItemDeleteArgs<ExtArgs>>): Prisma__OwnedItemClient<$Result.GetResult<Prisma.$OwnedItemPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one OwnedItem.
     * @param {OwnedItemUpdateArgs} args - Arguments to update one OwnedItem.
     * @example
     * // Update one OwnedItem
     * const ownedItem = await prisma.ownedItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OwnedItemUpdateArgs>(args: SelectSubset<T, OwnedItemUpdateArgs<ExtArgs>>): Prisma__OwnedItemClient<$Result.GetResult<Prisma.$OwnedItemPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more OwnedItems.
     * @param {OwnedItemDeleteManyArgs} args - Arguments to filter OwnedItems to delete.
     * @example
     * // Delete a few OwnedItems
     * const { count } = await prisma.ownedItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OwnedItemDeleteManyArgs>(args?: SelectSubset<T, OwnedItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OwnedItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OwnedItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OwnedItems
     * const ownedItem = await prisma.ownedItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OwnedItemUpdateManyArgs>(args: SelectSubset<T, OwnedItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one OwnedItem.
     * @param {OwnedItemUpsertArgs} args - Arguments to update or create a OwnedItem.
     * @example
     * // Update or create a OwnedItem
     * const ownedItem = await prisma.ownedItem.upsert({
     *   create: {
     *     // ... data to create a OwnedItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OwnedItem we want to update
     *   }
     * })
     */
    upsert<T extends OwnedItemUpsertArgs>(args: SelectSubset<T, OwnedItemUpsertArgs<ExtArgs>>): Prisma__OwnedItemClient<$Result.GetResult<Prisma.$OwnedItemPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of OwnedItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OwnedItemCountArgs} args - Arguments to filter OwnedItems to count.
     * @example
     * // Count the number of OwnedItems
     * const count = await prisma.ownedItem.count({
     *   where: {
     *     // ... the filter for the OwnedItems we want to count
     *   }
     * })
    **/
    count<T extends OwnedItemCountArgs>(
      args?: Subset<T, OwnedItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OwnedItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OwnedItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OwnedItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends OwnedItemAggregateArgs>(args: Subset<T, OwnedItemAggregateArgs>): Prisma.PrismaPromise<GetOwnedItemAggregateType<T>>

    /**
     * Group by OwnedItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OwnedItemGroupByArgs} args - Group by arguments.
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
      T extends OwnedItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OwnedItemGroupByArgs['orderBy'] }
        : { orderBy?: OwnedItemGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, OwnedItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOwnedItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OwnedItem model
   */
  readonly fields: OwnedItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OwnedItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OwnedItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    item<T extends ItemDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ItemDefaultArgs<ExtArgs>>): Prisma__ItemClient<$Result.GetResult<Prisma.$ItemPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the OwnedItem model
   */ 
  interface OwnedItemFieldRefs {
    readonly id: FieldRef<"OwnedItem", 'String'>
    readonly userId: FieldRef<"OwnedItem", 'String'>
    readonly itemId: FieldRef<"OwnedItem", 'String'>
    readonly quantity: FieldRef<"OwnedItem", 'Int'>
    readonly level: FieldRef<"OwnedItem", 'Int'>
    readonly purchasedAt: FieldRef<"OwnedItem", 'DateTime'>
    readonly updatedAt: FieldRef<"OwnedItem", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * OwnedItem findUnique
   */
  export type OwnedItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OwnedItem
     */
    select?: OwnedItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OwnedItemInclude<ExtArgs> | null
    /**
     * Filter, which OwnedItem to fetch.
     */
    where: OwnedItemWhereUniqueInput
  }

  /**
   * OwnedItem findUniqueOrThrow
   */
  export type OwnedItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OwnedItem
     */
    select?: OwnedItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OwnedItemInclude<ExtArgs> | null
    /**
     * Filter, which OwnedItem to fetch.
     */
    where: OwnedItemWhereUniqueInput
  }

  /**
   * OwnedItem findFirst
   */
  export type OwnedItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OwnedItem
     */
    select?: OwnedItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OwnedItemInclude<ExtArgs> | null
    /**
     * Filter, which OwnedItem to fetch.
     */
    where?: OwnedItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OwnedItems to fetch.
     */
    orderBy?: OwnedItemOrderByWithRelationInput | OwnedItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OwnedItems.
     */
    cursor?: OwnedItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OwnedItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OwnedItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OwnedItems.
     */
    distinct?: OwnedItemScalarFieldEnum | OwnedItemScalarFieldEnum[]
  }

  /**
   * OwnedItem findFirstOrThrow
   */
  export type OwnedItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OwnedItem
     */
    select?: OwnedItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OwnedItemInclude<ExtArgs> | null
    /**
     * Filter, which OwnedItem to fetch.
     */
    where?: OwnedItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OwnedItems to fetch.
     */
    orderBy?: OwnedItemOrderByWithRelationInput | OwnedItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OwnedItems.
     */
    cursor?: OwnedItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OwnedItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OwnedItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OwnedItems.
     */
    distinct?: OwnedItemScalarFieldEnum | OwnedItemScalarFieldEnum[]
  }

  /**
   * OwnedItem findMany
   */
  export type OwnedItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OwnedItem
     */
    select?: OwnedItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OwnedItemInclude<ExtArgs> | null
    /**
     * Filter, which OwnedItems to fetch.
     */
    where?: OwnedItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OwnedItems to fetch.
     */
    orderBy?: OwnedItemOrderByWithRelationInput | OwnedItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OwnedItems.
     */
    cursor?: OwnedItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OwnedItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OwnedItems.
     */
    skip?: number
    distinct?: OwnedItemScalarFieldEnum | OwnedItemScalarFieldEnum[]
  }

  /**
   * OwnedItem create
   */
  export type OwnedItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OwnedItem
     */
    select?: OwnedItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OwnedItemInclude<ExtArgs> | null
    /**
     * The data needed to create a OwnedItem.
     */
    data: XOR<OwnedItemCreateInput, OwnedItemUncheckedCreateInput>
  }

  /**
   * OwnedItem createMany
   */
  export type OwnedItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OwnedItems.
     */
    data: OwnedItemCreateManyInput | OwnedItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OwnedItem createManyAndReturn
   */
  export type OwnedItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OwnedItem
     */
    select?: OwnedItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many OwnedItems.
     */
    data: OwnedItemCreateManyInput | OwnedItemCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OwnedItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * OwnedItem update
   */
  export type OwnedItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OwnedItem
     */
    select?: OwnedItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OwnedItemInclude<ExtArgs> | null
    /**
     * The data needed to update a OwnedItem.
     */
    data: XOR<OwnedItemUpdateInput, OwnedItemUncheckedUpdateInput>
    /**
     * Choose, which OwnedItem to update.
     */
    where: OwnedItemWhereUniqueInput
  }

  /**
   * OwnedItem updateMany
   */
  export type OwnedItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OwnedItems.
     */
    data: XOR<OwnedItemUpdateManyMutationInput, OwnedItemUncheckedUpdateManyInput>
    /**
     * Filter which OwnedItems to update
     */
    where?: OwnedItemWhereInput
  }

  /**
   * OwnedItem upsert
   */
  export type OwnedItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OwnedItem
     */
    select?: OwnedItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OwnedItemInclude<ExtArgs> | null
    /**
     * The filter to search for the OwnedItem to update in case it exists.
     */
    where: OwnedItemWhereUniqueInput
    /**
     * In case the OwnedItem found by the `where` argument doesn't exist, create a new OwnedItem with this data.
     */
    create: XOR<OwnedItemCreateInput, OwnedItemUncheckedCreateInput>
    /**
     * In case the OwnedItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OwnedItemUpdateInput, OwnedItemUncheckedUpdateInput>
  }

  /**
   * OwnedItem delete
   */
  export type OwnedItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OwnedItem
     */
    select?: OwnedItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OwnedItemInclude<ExtArgs> | null
    /**
     * Filter which OwnedItem to delete.
     */
    where: OwnedItemWhereUniqueInput
  }

  /**
   * OwnedItem deleteMany
   */
  export type OwnedItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OwnedItems to delete
     */
    where?: OwnedItemWhereInput
  }

  /**
   * OwnedItem without action
   */
  export type OwnedItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OwnedItem
     */
    select?: OwnedItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OwnedItemInclude<ExtArgs> | null
  }


  /**
   * Model ProgramType
   */

  export type AggregateProgramType = {
    _count: ProgramTypeCountAggregateOutputType | null
    _avg: ProgramTypeAvgAggregateOutputType | null
    _sum: ProgramTypeSumAggregateOutputType | null
    _min: ProgramTypeMinAggregateOutputType | null
    _max: ProgramTypeMaxAggregateOutputType | null
  }

  export type ProgramTypeAvgAggregateOutputType = {
    baseDurationSecs: number | null
    baseReward: Decimal | null
    experienceReward: Decimal | null
    rewardMultiplier: number | null
    unlockLevel: number | null
  }

  export type ProgramTypeSumAggregateOutputType = {
    baseDurationSecs: number | null
    baseReward: Decimal | null
    experienceReward: Decimal | null
    rewardMultiplier: number | null
    unlockLevel: number | null
  }

  export type ProgramTypeMinAggregateOutputType = {
    id: string | null
    slug: string | null
    name: string | null
    description: string | null
    baseDurationSecs: number | null
    baseReward: Decimal | null
    experienceReward: Decimal | null
    rewardMultiplier: number | null
    unlockLevel: number | null
    iconUrl: string | null
    category: $Enums.ProgramCategory | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProgramTypeMaxAggregateOutputType = {
    id: string | null
    slug: string | null
    name: string | null
    description: string | null
    baseDurationSecs: number | null
    baseReward: Decimal | null
    experienceReward: Decimal | null
    rewardMultiplier: number | null
    unlockLevel: number | null
    iconUrl: string | null
    category: $Enums.ProgramCategory | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProgramTypeCountAggregateOutputType = {
    id: number
    slug: number
    name: number
    description: number
    baseDurationSecs: number
    baseReward: number
    experienceReward: number
    rewardMultiplier: number
    unlockLevel: number
    lootTable: number
    iconUrl: number
    category: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProgramTypeAvgAggregateInputType = {
    baseDurationSecs?: true
    baseReward?: true
    experienceReward?: true
    rewardMultiplier?: true
    unlockLevel?: true
  }

  export type ProgramTypeSumAggregateInputType = {
    baseDurationSecs?: true
    baseReward?: true
    experienceReward?: true
    rewardMultiplier?: true
    unlockLevel?: true
  }

  export type ProgramTypeMinAggregateInputType = {
    id?: true
    slug?: true
    name?: true
    description?: true
    baseDurationSecs?: true
    baseReward?: true
    experienceReward?: true
    rewardMultiplier?: true
    unlockLevel?: true
    iconUrl?: true
    category?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProgramTypeMaxAggregateInputType = {
    id?: true
    slug?: true
    name?: true
    description?: true
    baseDurationSecs?: true
    baseReward?: true
    experienceReward?: true
    rewardMultiplier?: true
    unlockLevel?: true
    iconUrl?: true
    category?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProgramTypeCountAggregateInputType = {
    id?: true
    slug?: true
    name?: true
    description?: true
    baseDurationSecs?: true
    baseReward?: true
    experienceReward?: true
    rewardMultiplier?: true
    unlockLevel?: true
    lootTable?: true
    iconUrl?: true
    category?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProgramTypeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProgramType to aggregate.
     */
    where?: ProgramTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProgramTypes to fetch.
     */
    orderBy?: ProgramTypeOrderByWithRelationInput | ProgramTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProgramTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProgramTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProgramTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProgramTypes
    **/
    _count?: true | ProgramTypeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProgramTypeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProgramTypeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProgramTypeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProgramTypeMaxAggregateInputType
  }

  export type GetProgramTypeAggregateType<T extends ProgramTypeAggregateArgs> = {
        [P in keyof T & keyof AggregateProgramType]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProgramType[P]>
      : GetScalarType<T[P], AggregateProgramType[P]>
  }




  export type ProgramTypeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProgramTypeWhereInput
    orderBy?: ProgramTypeOrderByWithAggregationInput | ProgramTypeOrderByWithAggregationInput[]
    by: ProgramTypeScalarFieldEnum[] | ProgramTypeScalarFieldEnum
    having?: ProgramTypeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProgramTypeCountAggregateInputType | true
    _avg?: ProgramTypeAvgAggregateInputType
    _sum?: ProgramTypeSumAggregateInputType
    _min?: ProgramTypeMinAggregateInputType
    _max?: ProgramTypeMaxAggregateInputType
  }

  export type ProgramTypeGroupByOutputType = {
    id: string
    slug: string
    name: string
    description: string
    baseDurationSecs: number
    baseReward: Decimal
    experienceReward: Decimal
    rewardMultiplier: number
    unlockLevel: number
    lootTable: JsonValue | null
    iconUrl: string | null
    category: $Enums.ProgramCategory
    createdAt: Date
    updatedAt: Date
    _count: ProgramTypeCountAggregateOutputType | null
    _avg: ProgramTypeAvgAggregateOutputType | null
    _sum: ProgramTypeSumAggregateOutputType | null
    _min: ProgramTypeMinAggregateOutputType | null
    _max: ProgramTypeMaxAggregateOutputType | null
  }

  type GetProgramTypeGroupByPayload<T extends ProgramTypeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProgramTypeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProgramTypeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProgramTypeGroupByOutputType[P]>
            : GetScalarType<T[P], ProgramTypeGroupByOutputType[P]>
        }
      >
    >


  export type ProgramTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    name?: boolean
    description?: boolean
    baseDurationSecs?: boolean
    baseReward?: boolean
    experienceReward?: boolean
    rewardMultiplier?: boolean
    unlockLevel?: boolean
    lootTable?: boolean
    iconUrl?: boolean
    category?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    activePrograms?: boolean | ProgramType$activeProgramsArgs<ExtArgs>
    _count?: boolean | ProgramTypeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["programType"]>

  export type ProgramTypeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    name?: boolean
    description?: boolean
    baseDurationSecs?: boolean
    baseReward?: boolean
    experienceReward?: boolean
    rewardMultiplier?: boolean
    unlockLevel?: boolean
    lootTable?: boolean
    iconUrl?: boolean
    category?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["programType"]>

  export type ProgramTypeSelectScalar = {
    id?: boolean
    slug?: boolean
    name?: boolean
    description?: boolean
    baseDurationSecs?: boolean
    baseReward?: boolean
    experienceReward?: boolean
    rewardMultiplier?: boolean
    unlockLevel?: boolean
    lootTable?: boolean
    iconUrl?: boolean
    category?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProgramTypeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    activePrograms?: boolean | ProgramType$activeProgramsArgs<ExtArgs>
    _count?: boolean | ProgramTypeCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProgramTypeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ProgramTypePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProgramType"
    objects: {
      activePrograms: Prisma.$ActiveProgramPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      slug: string
      name: string
      description: string
      baseDurationSecs: number
      baseReward: Prisma.Decimal
      experienceReward: Prisma.Decimal
      rewardMultiplier: number
      unlockLevel: number
      lootTable: Prisma.JsonValue | null
      iconUrl: string | null
      category: $Enums.ProgramCategory
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["programType"]>
    composites: {}
  }

  type ProgramTypeGetPayload<S extends boolean | null | undefined | ProgramTypeDefaultArgs> = $Result.GetResult<Prisma.$ProgramTypePayload, S>

  type ProgramTypeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ProgramTypeFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ProgramTypeCountAggregateInputType | true
    }

  export interface ProgramTypeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProgramType'], meta: { name: 'ProgramType' } }
    /**
     * Find zero or one ProgramType that matches the filter.
     * @param {ProgramTypeFindUniqueArgs} args - Arguments to find a ProgramType
     * @example
     * // Get one ProgramType
     * const programType = await prisma.programType.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProgramTypeFindUniqueArgs>(args: SelectSubset<T, ProgramTypeFindUniqueArgs<ExtArgs>>): Prisma__ProgramTypeClient<$Result.GetResult<Prisma.$ProgramTypePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ProgramType that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ProgramTypeFindUniqueOrThrowArgs} args - Arguments to find a ProgramType
     * @example
     * // Get one ProgramType
     * const programType = await prisma.programType.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProgramTypeFindUniqueOrThrowArgs>(args: SelectSubset<T, ProgramTypeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProgramTypeClient<$Result.GetResult<Prisma.$ProgramTypePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ProgramType that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgramTypeFindFirstArgs} args - Arguments to find a ProgramType
     * @example
     * // Get one ProgramType
     * const programType = await prisma.programType.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProgramTypeFindFirstArgs>(args?: SelectSubset<T, ProgramTypeFindFirstArgs<ExtArgs>>): Prisma__ProgramTypeClient<$Result.GetResult<Prisma.$ProgramTypePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ProgramType that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgramTypeFindFirstOrThrowArgs} args - Arguments to find a ProgramType
     * @example
     * // Get one ProgramType
     * const programType = await prisma.programType.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProgramTypeFindFirstOrThrowArgs>(args?: SelectSubset<T, ProgramTypeFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProgramTypeClient<$Result.GetResult<Prisma.$ProgramTypePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ProgramTypes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgramTypeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProgramTypes
     * const programTypes = await prisma.programType.findMany()
     * 
     * // Get first 10 ProgramTypes
     * const programTypes = await prisma.programType.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const programTypeWithIdOnly = await prisma.programType.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProgramTypeFindManyArgs>(args?: SelectSubset<T, ProgramTypeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProgramTypePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ProgramType.
     * @param {ProgramTypeCreateArgs} args - Arguments to create a ProgramType.
     * @example
     * // Create one ProgramType
     * const ProgramType = await prisma.programType.create({
     *   data: {
     *     // ... data to create a ProgramType
     *   }
     * })
     * 
     */
    create<T extends ProgramTypeCreateArgs>(args: SelectSubset<T, ProgramTypeCreateArgs<ExtArgs>>): Prisma__ProgramTypeClient<$Result.GetResult<Prisma.$ProgramTypePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ProgramTypes.
     * @param {ProgramTypeCreateManyArgs} args - Arguments to create many ProgramTypes.
     * @example
     * // Create many ProgramTypes
     * const programType = await prisma.programType.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProgramTypeCreateManyArgs>(args?: SelectSubset<T, ProgramTypeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProgramTypes and returns the data saved in the database.
     * @param {ProgramTypeCreateManyAndReturnArgs} args - Arguments to create many ProgramTypes.
     * @example
     * // Create many ProgramTypes
     * const programType = await prisma.programType.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProgramTypes and only return the `id`
     * const programTypeWithIdOnly = await prisma.programType.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProgramTypeCreateManyAndReturnArgs>(args?: SelectSubset<T, ProgramTypeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProgramTypePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ProgramType.
     * @param {ProgramTypeDeleteArgs} args - Arguments to delete one ProgramType.
     * @example
     * // Delete one ProgramType
     * const ProgramType = await prisma.programType.delete({
     *   where: {
     *     // ... filter to delete one ProgramType
     *   }
     * })
     * 
     */
    delete<T extends ProgramTypeDeleteArgs>(args: SelectSubset<T, ProgramTypeDeleteArgs<ExtArgs>>): Prisma__ProgramTypeClient<$Result.GetResult<Prisma.$ProgramTypePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ProgramType.
     * @param {ProgramTypeUpdateArgs} args - Arguments to update one ProgramType.
     * @example
     * // Update one ProgramType
     * const programType = await prisma.programType.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProgramTypeUpdateArgs>(args: SelectSubset<T, ProgramTypeUpdateArgs<ExtArgs>>): Prisma__ProgramTypeClient<$Result.GetResult<Prisma.$ProgramTypePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ProgramTypes.
     * @param {ProgramTypeDeleteManyArgs} args - Arguments to filter ProgramTypes to delete.
     * @example
     * // Delete a few ProgramTypes
     * const { count } = await prisma.programType.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProgramTypeDeleteManyArgs>(args?: SelectSubset<T, ProgramTypeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProgramTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgramTypeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProgramTypes
     * const programType = await prisma.programType.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProgramTypeUpdateManyArgs>(args: SelectSubset<T, ProgramTypeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ProgramType.
     * @param {ProgramTypeUpsertArgs} args - Arguments to update or create a ProgramType.
     * @example
     * // Update or create a ProgramType
     * const programType = await prisma.programType.upsert({
     *   create: {
     *     // ... data to create a ProgramType
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProgramType we want to update
     *   }
     * })
     */
    upsert<T extends ProgramTypeUpsertArgs>(args: SelectSubset<T, ProgramTypeUpsertArgs<ExtArgs>>): Prisma__ProgramTypeClient<$Result.GetResult<Prisma.$ProgramTypePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ProgramTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgramTypeCountArgs} args - Arguments to filter ProgramTypes to count.
     * @example
     * // Count the number of ProgramTypes
     * const count = await prisma.programType.count({
     *   where: {
     *     // ... the filter for the ProgramTypes we want to count
     *   }
     * })
    **/
    count<T extends ProgramTypeCountArgs>(
      args?: Subset<T, ProgramTypeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProgramTypeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProgramType.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgramTypeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProgramTypeAggregateArgs>(args: Subset<T, ProgramTypeAggregateArgs>): Prisma.PrismaPromise<GetProgramTypeAggregateType<T>>

    /**
     * Group by ProgramType.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgramTypeGroupByArgs} args - Group by arguments.
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
      T extends ProgramTypeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProgramTypeGroupByArgs['orderBy'] }
        : { orderBy?: ProgramTypeGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ProgramTypeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProgramTypeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProgramType model
   */
  readonly fields: ProgramTypeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProgramType.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProgramTypeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    activePrograms<T extends ProgramType$activeProgramsArgs<ExtArgs> = {}>(args?: Subset<T, ProgramType$activeProgramsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActiveProgramPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the ProgramType model
   */ 
  interface ProgramTypeFieldRefs {
    readonly id: FieldRef<"ProgramType", 'String'>
    readonly slug: FieldRef<"ProgramType", 'String'>
    readonly name: FieldRef<"ProgramType", 'String'>
    readonly description: FieldRef<"ProgramType", 'String'>
    readonly baseDurationSecs: FieldRef<"ProgramType", 'Int'>
    readonly baseReward: FieldRef<"ProgramType", 'Decimal'>
    readonly experienceReward: FieldRef<"ProgramType", 'Decimal'>
    readonly rewardMultiplier: FieldRef<"ProgramType", 'Float'>
    readonly unlockLevel: FieldRef<"ProgramType", 'Int'>
    readonly lootTable: FieldRef<"ProgramType", 'Json'>
    readonly iconUrl: FieldRef<"ProgramType", 'String'>
    readonly category: FieldRef<"ProgramType", 'ProgramCategory'>
    readonly createdAt: FieldRef<"ProgramType", 'DateTime'>
    readonly updatedAt: FieldRef<"ProgramType", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProgramType findUnique
   */
  export type ProgramTypeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgramType
     */
    select?: ProgramTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramTypeInclude<ExtArgs> | null
    /**
     * Filter, which ProgramType to fetch.
     */
    where: ProgramTypeWhereUniqueInput
  }

  /**
   * ProgramType findUniqueOrThrow
   */
  export type ProgramTypeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgramType
     */
    select?: ProgramTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramTypeInclude<ExtArgs> | null
    /**
     * Filter, which ProgramType to fetch.
     */
    where: ProgramTypeWhereUniqueInput
  }

  /**
   * ProgramType findFirst
   */
  export type ProgramTypeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgramType
     */
    select?: ProgramTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramTypeInclude<ExtArgs> | null
    /**
     * Filter, which ProgramType to fetch.
     */
    where?: ProgramTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProgramTypes to fetch.
     */
    orderBy?: ProgramTypeOrderByWithRelationInput | ProgramTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProgramTypes.
     */
    cursor?: ProgramTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProgramTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProgramTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProgramTypes.
     */
    distinct?: ProgramTypeScalarFieldEnum | ProgramTypeScalarFieldEnum[]
  }

  /**
   * ProgramType findFirstOrThrow
   */
  export type ProgramTypeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgramType
     */
    select?: ProgramTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramTypeInclude<ExtArgs> | null
    /**
     * Filter, which ProgramType to fetch.
     */
    where?: ProgramTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProgramTypes to fetch.
     */
    orderBy?: ProgramTypeOrderByWithRelationInput | ProgramTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProgramTypes.
     */
    cursor?: ProgramTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProgramTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProgramTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProgramTypes.
     */
    distinct?: ProgramTypeScalarFieldEnum | ProgramTypeScalarFieldEnum[]
  }

  /**
   * ProgramType findMany
   */
  export type ProgramTypeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgramType
     */
    select?: ProgramTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramTypeInclude<ExtArgs> | null
    /**
     * Filter, which ProgramTypes to fetch.
     */
    where?: ProgramTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProgramTypes to fetch.
     */
    orderBy?: ProgramTypeOrderByWithRelationInput | ProgramTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProgramTypes.
     */
    cursor?: ProgramTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProgramTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProgramTypes.
     */
    skip?: number
    distinct?: ProgramTypeScalarFieldEnum | ProgramTypeScalarFieldEnum[]
  }

  /**
   * ProgramType create
   */
  export type ProgramTypeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgramType
     */
    select?: ProgramTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramTypeInclude<ExtArgs> | null
    /**
     * The data needed to create a ProgramType.
     */
    data: XOR<ProgramTypeCreateInput, ProgramTypeUncheckedCreateInput>
  }

  /**
   * ProgramType createMany
   */
  export type ProgramTypeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProgramTypes.
     */
    data: ProgramTypeCreateManyInput | ProgramTypeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProgramType createManyAndReturn
   */
  export type ProgramTypeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgramType
     */
    select?: ProgramTypeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ProgramTypes.
     */
    data: ProgramTypeCreateManyInput | ProgramTypeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProgramType update
   */
  export type ProgramTypeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgramType
     */
    select?: ProgramTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramTypeInclude<ExtArgs> | null
    /**
     * The data needed to update a ProgramType.
     */
    data: XOR<ProgramTypeUpdateInput, ProgramTypeUncheckedUpdateInput>
    /**
     * Choose, which ProgramType to update.
     */
    where: ProgramTypeWhereUniqueInput
  }

  /**
   * ProgramType updateMany
   */
  export type ProgramTypeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProgramTypes.
     */
    data: XOR<ProgramTypeUpdateManyMutationInput, ProgramTypeUncheckedUpdateManyInput>
    /**
     * Filter which ProgramTypes to update
     */
    where?: ProgramTypeWhereInput
  }

  /**
   * ProgramType upsert
   */
  export type ProgramTypeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgramType
     */
    select?: ProgramTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramTypeInclude<ExtArgs> | null
    /**
     * The filter to search for the ProgramType to update in case it exists.
     */
    where: ProgramTypeWhereUniqueInput
    /**
     * In case the ProgramType found by the `where` argument doesn't exist, create a new ProgramType with this data.
     */
    create: XOR<ProgramTypeCreateInput, ProgramTypeUncheckedCreateInput>
    /**
     * In case the ProgramType was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProgramTypeUpdateInput, ProgramTypeUncheckedUpdateInput>
  }

  /**
   * ProgramType delete
   */
  export type ProgramTypeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgramType
     */
    select?: ProgramTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramTypeInclude<ExtArgs> | null
    /**
     * Filter which ProgramType to delete.
     */
    where: ProgramTypeWhereUniqueInput
  }

  /**
   * ProgramType deleteMany
   */
  export type ProgramTypeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProgramTypes to delete
     */
    where?: ProgramTypeWhereInput
  }

  /**
   * ProgramType.activePrograms
   */
  export type ProgramType$activeProgramsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActiveProgram
     */
    select?: ActiveProgramSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActiveProgramInclude<ExtArgs> | null
    where?: ActiveProgramWhereInput
    orderBy?: ActiveProgramOrderByWithRelationInput | ActiveProgramOrderByWithRelationInput[]
    cursor?: ActiveProgramWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ActiveProgramScalarFieldEnum | ActiveProgramScalarFieldEnum[]
  }

  /**
   * ProgramType without action
   */
  export type ProgramTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgramType
     */
    select?: ProgramTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgramTypeInclude<ExtArgs> | null
  }


  /**
   * Model ActiveProgram
   */

  export type AggregateActiveProgram = {
    _count: ActiveProgramCountAggregateOutputType | null
    _avg: ActiveProgramAvgAggregateOutputType | null
    _sum: ActiveProgramSumAggregateOutputType | null
    _min: ActiveProgramMinAggregateOutputType | null
    _max: ActiveProgramMaxAggregateOutputType | null
  }

  export type ActiveProgramAvgAggregateOutputType = {
    earnedReward: Decimal | null
    earnedExp: Decimal | null
  }

  export type ActiveProgramSumAggregateOutputType = {
    earnedReward: Decimal | null
    earnedExp: Decimal | null
  }

  export type ActiveProgramMinAggregateOutputType = {
    id: string | null
    userId: string | null
    programTypeId: string | null
    startedAt: Date | null
    estimatedEndAt: Date | null
    completedAt: Date | null
    status: $Enums.ProgramStatus | null
    bullJobId: string | null
    earnedReward: Decimal | null
    earnedExp: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ActiveProgramMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    programTypeId: string | null
    startedAt: Date | null
    estimatedEndAt: Date | null
    completedAt: Date | null
    status: $Enums.ProgramStatus | null
    bullJobId: string | null
    earnedReward: Decimal | null
    earnedExp: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ActiveProgramCountAggregateOutputType = {
    id: number
    userId: number
    programTypeId: number
    startedAt: number
    estimatedEndAt: number
    completedAt: number
    status: number
    bullJobId: number
    earnedReward: number
    earnedExp: number
    lootItems: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ActiveProgramAvgAggregateInputType = {
    earnedReward?: true
    earnedExp?: true
  }

  export type ActiveProgramSumAggregateInputType = {
    earnedReward?: true
    earnedExp?: true
  }

  export type ActiveProgramMinAggregateInputType = {
    id?: true
    userId?: true
    programTypeId?: true
    startedAt?: true
    estimatedEndAt?: true
    completedAt?: true
    status?: true
    bullJobId?: true
    earnedReward?: true
    earnedExp?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ActiveProgramMaxAggregateInputType = {
    id?: true
    userId?: true
    programTypeId?: true
    startedAt?: true
    estimatedEndAt?: true
    completedAt?: true
    status?: true
    bullJobId?: true
    earnedReward?: true
    earnedExp?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ActiveProgramCountAggregateInputType = {
    id?: true
    userId?: true
    programTypeId?: true
    startedAt?: true
    estimatedEndAt?: true
    completedAt?: true
    status?: true
    bullJobId?: true
    earnedReward?: true
    earnedExp?: true
    lootItems?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ActiveProgramAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ActiveProgram to aggregate.
     */
    where?: ActiveProgramWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActivePrograms to fetch.
     */
    orderBy?: ActiveProgramOrderByWithRelationInput | ActiveProgramOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ActiveProgramWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActivePrograms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActivePrograms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ActivePrograms
    **/
    _count?: true | ActiveProgramCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ActiveProgramAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ActiveProgramSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ActiveProgramMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ActiveProgramMaxAggregateInputType
  }

  export type GetActiveProgramAggregateType<T extends ActiveProgramAggregateArgs> = {
        [P in keyof T & keyof AggregateActiveProgram]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateActiveProgram[P]>
      : GetScalarType<T[P], AggregateActiveProgram[P]>
  }




  export type ActiveProgramGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ActiveProgramWhereInput
    orderBy?: ActiveProgramOrderByWithAggregationInput | ActiveProgramOrderByWithAggregationInput[]
    by: ActiveProgramScalarFieldEnum[] | ActiveProgramScalarFieldEnum
    having?: ActiveProgramScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ActiveProgramCountAggregateInputType | true
    _avg?: ActiveProgramAvgAggregateInputType
    _sum?: ActiveProgramSumAggregateInputType
    _min?: ActiveProgramMinAggregateInputType
    _max?: ActiveProgramMaxAggregateInputType
  }

  export type ActiveProgramGroupByOutputType = {
    id: string
    userId: string
    programTypeId: string
    startedAt: Date
    estimatedEndAt: Date
    completedAt: Date | null
    status: $Enums.ProgramStatus
    bullJobId: string | null
    earnedReward: Decimal | null
    earnedExp: Decimal | null
    lootItems: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: ActiveProgramCountAggregateOutputType | null
    _avg: ActiveProgramAvgAggregateOutputType | null
    _sum: ActiveProgramSumAggregateOutputType | null
    _min: ActiveProgramMinAggregateOutputType | null
    _max: ActiveProgramMaxAggregateOutputType | null
  }

  type GetActiveProgramGroupByPayload<T extends ActiveProgramGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ActiveProgramGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ActiveProgramGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ActiveProgramGroupByOutputType[P]>
            : GetScalarType<T[P], ActiveProgramGroupByOutputType[P]>
        }
      >
    >


  export type ActiveProgramSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    programTypeId?: boolean
    startedAt?: boolean
    estimatedEndAt?: boolean
    completedAt?: boolean
    status?: boolean
    bullJobId?: boolean
    earnedReward?: boolean
    earnedExp?: boolean
    lootItems?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    programType?: boolean | ProgramTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["activeProgram"]>

  export type ActiveProgramSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    programTypeId?: boolean
    startedAt?: boolean
    estimatedEndAt?: boolean
    completedAt?: boolean
    status?: boolean
    bullJobId?: boolean
    earnedReward?: boolean
    earnedExp?: boolean
    lootItems?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    programType?: boolean | ProgramTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["activeProgram"]>

  export type ActiveProgramSelectScalar = {
    id?: boolean
    userId?: boolean
    programTypeId?: boolean
    startedAt?: boolean
    estimatedEndAt?: boolean
    completedAt?: boolean
    status?: boolean
    bullJobId?: boolean
    earnedReward?: boolean
    earnedExp?: boolean
    lootItems?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ActiveProgramInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    programType?: boolean | ProgramTypeDefaultArgs<ExtArgs>
  }
  export type ActiveProgramIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    programType?: boolean | ProgramTypeDefaultArgs<ExtArgs>
  }

  export type $ActiveProgramPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ActiveProgram"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      programType: Prisma.$ProgramTypePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      programTypeId: string
      startedAt: Date
      estimatedEndAt: Date
      completedAt: Date | null
      status: $Enums.ProgramStatus
      bullJobId: string | null
      earnedReward: Prisma.Decimal | null
      earnedExp: Prisma.Decimal | null
      lootItems: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["activeProgram"]>
    composites: {}
  }

  type ActiveProgramGetPayload<S extends boolean | null | undefined | ActiveProgramDefaultArgs> = $Result.GetResult<Prisma.$ActiveProgramPayload, S>

  type ActiveProgramCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ActiveProgramFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ActiveProgramCountAggregateInputType | true
    }

  export interface ActiveProgramDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ActiveProgram'], meta: { name: 'ActiveProgram' } }
    /**
     * Find zero or one ActiveProgram that matches the filter.
     * @param {ActiveProgramFindUniqueArgs} args - Arguments to find a ActiveProgram
     * @example
     * // Get one ActiveProgram
     * const activeProgram = await prisma.activeProgram.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ActiveProgramFindUniqueArgs>(args: SelectSubset<T, ActiveProgramFindUniqueArgs<ExtArgs>>): Prisma__ActiveProgramClient<$Result.GetResult<Prisma.$ActiveProgramPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ActiveProgram that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ActiveProgramFindUniqueOrThrowArgs} args - Arguments to find a ActiveProgram
     * @example
     * // Get one ActiveProgram
     * const activeProgram = await prisma.activeProgram.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ActiveProgramFindUniqueOrThrowArgs>(args: SelectSubset<T, ActiveProgramFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ActiveProgramClient<$Result.GetResult<Prisma.$ActiveProgramPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ActiveProgram that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActiveProgramFindFirstArgs} args - Arguments to find a ActiveProgram
     * @example
     * // Get one ActiveProgram
     * const activeProgram = await prisma.activeProgram.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ActiveProgramFindFirstArgs>(args?: SelectSubset<T, ActiveProgramFindFirstArgs<ExtArgs>>): Prisma__ActiveProgramClient<$Result.GetResult<Prisma.$ActiveProgramPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ActiveProgram that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActiveProgramFindFirstOrThrowArgs} args - Arguments to find a ActiveProgram
     * @example
     * // Get one ActiveProgram
     * const activeProgram = await prisma.activeProgram.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ActiveProgramFindFirstOrThrowArgs>(args?: SelectSubset<T, ActiveProgramFindFirstOrThrowArgs<ExtArgs>>): Prisma__ActiveProgramClient<$Result.GetResult<Prisma.$ActiveProgramPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ActivePrograms that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActiveProgramFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ActivePrograms
     * const activePrograms = await prisma.activeProgram.findMany()
     * 
     * // Get first 10 ActivePrograms
     * const activePrograms = await prisma.activeProgram.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const activeProgramWithIdOnly = await prisma.activeProgram.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ActiveProgramFindManyArgs>(args?: SelectSubset<T, ActiveProgramFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActiveProgramPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ActiveProgram.
     * @param {ActiveProgramCreateArgs} args - Arguments to create a ActiveProgram.
     * @example
     * // Create one ActiveProgram
     * const ActiveProgram = await prisma.activeProgram.create({
     *   data: {
     *     // ... data to create a ActiveProgram
     *   }
     * })
     * 
     */
    create<T extends ActiveProgramCreateArgs>(args: SelectSubset<T, ActiveProgramCreateArgs<ExtArgs>>): Prisma__ActiveProgramClient<$Result.GetResult<Prisma.$ActiveProgramPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ActivePrograms.
     * @param {ActiveProgramCreateManyArgs} args - Arguments to create many ActivePrograms.
     * @example
     * // Create many ActivePrograms
     * const activeProgram = await prisma.activeProgram.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ActiveProgramCreateManyArgs>(args?: SelectSubset<T, ActiveProgramCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ActivePrograms and returns the data saved in the database.
     * @param {ActiveProgramCreateManyAndReturnArgs} args - Arguments to create many ActivePrograms.
     * @example
     * // Create many ActivePrograms
     * const activeProgram = await prisma.activeProgram.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ActivePrograms and only return the `id`
     * const activeProgramWithIdOnly = await prisma.activeProgram.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ActiveProgramCreateManyAndReturnArgs>(args?: SelectSubset<T, ActiveProgramCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActiveProgramPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ActiveProgram.
     * @param {ActiveProgramDeleteArgs} args - Arguments to delete one ActiveProgram.
     * @example
     * // Delete one ActiveProgram
     * const ActiveProgram = await prisma.activeProgram.delete({
     *   where: {
     *     // ... filter to delete one ActiveProgram
     *   }
     * })
     * 
     */
    delete<T extends ActiveProgramDeleteArgs>(args: SelectSubset<T, ActiveProgramDeleteArgs<ExtArgs>>): Prisma__ActiveProgramClient<$Result.GetResult<Prisma.$ActiveProgramPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ActiveProgram.
     * @param {ActiveProgramUpdateArgs} args - Arguments to update one ActiveProgram.
     * @example
     * // Update one ActiveProgram
     * const activeProgram = await prisma.activeProgram.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ActiveProgramUpdateArgs>(args: SelectSubset<T, ActiveProgramUpdateArgs<ExtArgs>>): Prisma__ActiveProgramClient<$Result.GetResult<Prisma.$ActiveProgramPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ActivePrograms.
     * @param {ActiveProgramDeleteManyArgs} args - Arguments to filter ActivePrograms to delete.
     * @example
     * // Delete a few ActivePrograms
     * const { count } = await prisma.activeProgram.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ActiveProgramDeleteManyArgs>(args?: SelectSubset<T, ActiveProgramDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ActivePrograms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActiveProgramUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ActivePrograms
     * const activeProgram = await prisma.activeProgram.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ActiveProgramUpdateManyArgs>(args: SelectSubset<T, ActiveProgramUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ActiveProgram.
     * @param {ActiveProgramUpsertArgs} args - Arguments to update or create a ActiveProgram.
     * @example
     * // Update or create a ActiveProgram
     * const activeProgram = await prisma.activeProgram.upsert({
     *   create: {
     *     // ... data to create a ActiveProgram
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ActiveProgram we want to update
     *   }
     * })
     */
    upsert<T extends ActiveProgramUpsertArgs>(args: SelectSubset<T, ActiveProgramUpsertArgs<ExtArgs>>): Prisma__ActiveProgramClient<$Result.GetResult<Prisma.$ActiveProgramPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ActivePrograms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActiveProgramCountArgs} args - Arguments to filter ActivePrograms to count.
     * @example
     * // Count the number of ActivePrograms
     * const count = await prisma.activeProgram.count({
     *   where: {
     *     // ... the filter for the ActivePrograms we want to count
     *   }
     * })
    **/
    count<T extends ActiveProgramCountArgs>(
      args?: Subset<T, ActiveProgramCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ActiveProgramCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ActiveProgram.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActiveProgramAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ActiveProgramAggregateArgs>(args: Subset<T, ActiveProgramAggregateArgs>): Prisma.PrismaPromise<GetActiveProgramAggregateType<T>>

    /**
     * Group by ActiveProgram.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActiveProgramGroupByArgs} args - Group by arguments.
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
      T extends ActiveProgramGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ActiveProgramGroupByArgs['orderBy'] }
        : { orderBy?: ActiveProgramGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ActiveProgramGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetActiveProgramGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ActiveProgram model
   */
  readonly fields: ActiveProgramFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ActiveProgram.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ActiveProgramClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    programType<T extends ProgramTypeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProgramTypeDefaultArgs<ExtArgs>>): Prisma__ProgramTypeClient<$Result.GetResult<Prisma.$ProgramTypePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the ActiveProgram model
   */ 
  interface ActiveProgramFieldRefs {
    readonly id: FieldRef<"ActiveProgram", 'String'>
    readonly userId: FieldRef<"ActiveProgram", 'String'>
    readonly programTypeId: FieldRef<"ActiveProgram", 'String'>
    readonly startedAt: FieldRef<"ActiveProgram", 'DateTime'>
    readonly estimatedEndAt: FieldRef<"ActiveProgram", 'DateTime'>
    readonly completedAt: FieldRef<"ActiveProgram", 'DateTime'>
    readonly status: FieldRef<"ActiveProgram", 'ProgramStatus'>
    readonly bullJobId: FieldRef<"ActiveProgram", 'String'>
    readonly earnedReward: FieldRef<"ActiveProgram", 'Decimal'>
    readonly earnedExp: FieldRef<"ActiveProgram", 'Decimal'>
    readonly lootItems: FieldRef<"ActiveProgram", 'Json'>
    readonly createdAt: FieldRef<"ActiveProgram", 'DateTime'>
    readonly updatedAt: FieldRef<"ActiveProgram", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ActiveProgram findUnique
   */
  export type ActiveProgramFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActiveProgram
     */
    select?: ActiveProgramSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActiveProgramInclude<ExtArgs> | null
    /**
     * Filter, which ActiveProgram to fetch.
     */
    where: ActiveProgramWhereUniqueInput
  }

  /**
   * ActiveProgram findUniqueOrThrow
   */
  export type ActiveProgramFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActiveProgram
     */
    select?: ActiveProgramSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActiveProgramInclude<ExtArgs> | null
    /**
     * Filter, which ActiveProgram to fetch.
     */
    where: ActiveProgramWhereUniqueInput
  }

  /**
   * ActiveProgram findFirst
   */
  export type ActiveProgramFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActiveProgram
     */
    select?: ActiveProgramSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActiveProgramInclude<ExtArgs> | null
    /**
     * Filter, which ActiveProgram to fetch.
     */
    where?: ActiveProgramWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActivePrograms to fetch.
     */
    orderBy?: ActiveProgramOrderByWithRelationInput | ActiveProgramOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ActivePrograms.
     */
    cursor?: ActiveProgramWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActivePrograms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActivePrograms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ActivePrograms.
     */
    distinct?: ActiveProgramScalarFieldEnum | ActiveProgramScalarFieldEnum[]
  }

  /**
   * ActiveProgram findFirstOrThrow
   */
  export type ActiveProgramFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActiveProgram
     */
    select?: ActiveProgramSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActiveProgramInclude<ExtArgs> | null
    /**
     * Filter, which ActiveProgram to fetch.
     */
    where?: ActiveProgramWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActivePrograms to fetch.
     */
    orderBy?: ActiveProgramOrderByWithRelationInput | ActiveProgramOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ActivePrograms.
     */
    cursor?: ActiveProgramWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActivePrograms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActivePrograms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ActivePrograms.
     */
    distinct?: ActiveProgramScalarFieldEnum | ActiveProgramScalarFieldEnum[]
  }

  /**
   * ActiveProgram findMany
   */
  export type ActiveProgramFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActiveProgram
     */
    select?: ActiveProgramSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActiveProgramInclude<ExtArgs> | null
    /**
     * Filter, which ActivePrograms to fetch.
     */
    where?: ActiveProgramWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActivePrograms to fetch.
     */
    orderBy?: ActiveProgramOrderByWithRelationInput | ActiveProgramOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ActivePrograms.
     */
    cursor?: ActiveProgramWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActivePrograms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActivePrograms.
     */
    skip?: number
    distinct?: ActiveProgramScalarFieldEnum | ActiveProgramScalarFieldEnum[]
  }

  /**
   * ActiveProgram create
   */
  export type ActiveProgramCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActiveProgram
     */
    select?: ActiveProgramSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActiveProgramInclude<ExtArgs> | null
    /**
     * The data needed to create a ActiveProgram.
     */
    data: XOR<ActiveProgramCreateInput, ActiveProgramUncheckedCreateInput>
  }

  /**
   * ActiveProgram createMany
   */
  export type ActiveProgramCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ActivePrograms.
     */
    data: ActiveProgramCreateManyInput | ActiveProgramCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ActiveProgram createManyAndReturn
   */
  export type ActiveProgramCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActiveProgram
     */
    select?: ActiveProgramSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ActivePrograms.
     */
    data: ActiveProgramCreateManyInput | ActiveProgramCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActiveProgramIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ActiveProgram update
   */
  export type ActiveProgramUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActiveProgram
     */
    select?: ActiveProgramSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActiveProgramInclude<ExtArgs> | null
    /**
     * The data needed to update a ActiveProgram.
     */
    data: XOR<ActiveProgramUpdateInput, ActiveProgramUncheckedUpdateInput>
    /**
     * Choose, which ActiveProgram to update.
     */
    where: ActiveProgramWhereUniqueInput
  }

  /**
   * ActiveProgram updateMany
   */
  export type ActiveProgramUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ActivePrograms.
     */
    data: XOR<ActiveProgramUpdateManyMutationInput, ActiveProgramUncheckedUpdateManyInput>
    /**
     * Filter which ActivePrograms to update
     */
    where?: ActiveProgramWhereInput
  }

  /**
   * ActiveProgram upsert
   */
  export type ActiveProgramUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActiveProgram
     */
    select?: ActiveProgramSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActiveProgramInclude<ExtArgs> | null
    /**
     * The filter to search for the ActiveProgram to update in case it exists.
     */
    where: ActiveProgramWhereUniqueInput
    /**
     * In case the ActiveProgram found by the `where` argument doesn't exist, create a new ActiveProgram with this data.
     */
    create: XOR<ActiveProgramCreateInput, ActiveProgramUncheckedCreateInput>
    /**
     * In case the ActiveProgram was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ActiveProgramUpdateInput, ActiveProgramUncheckedUpdateInput>
  }

  /**
   * ActiveProgram delete
   */
  export type ActiveProgramDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActiveProgram
     */
    select?: ActiveProgramSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActiveProgramInclude<ExtArgs> | null
    /**
     * Filter which ActiveProgram to delete.
     */
    where: ActiveProgramWhereUniqueInput
  }

  /**
   * ActiveProgram deleteMany
   */
  export type ActiveProgramDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ActivePrograms to delete
     */
    where?: ActiveProgramWhereInput
  }

  /**
   * ActiveProgram without action
   */
  export type ActiveProgramDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActiveProgram
     */
    select?: ActiveProgramSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActiveProgramInclude<ExtArgs> | null
  }


  /**
   * Model Transaction
   */

  export type AggregateTransaction = {
    _count: TransactionCountAggregateOutputType | null
    _avg: TransactionAvgAggregateOutputType | null
    _sum: TransactionSumAggregateOutputType | null
    _min: TransactionMinAggregateOutputType | null
    _max: TransactionMaxAggregateOutputType | null
  }

  export type TransactionAvgAggregateOutputType = {
    amountCents: number | null
    retryCount: number | null
  }

  export type TransactionSumAggregateOutputType = {
    amountCents: number | null
    retryCount: number | null
  }

  export type TransactionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    stripePaymentId: string | null
    stripeCustomerId: string | null
    amountCents: number | null
    currency: string | null
    status: $Enums.TransactionStatus | null
    processedAt: Date | null
    idempotencyKey: string | null
    productType: $Enums.ProductType | null
    fulfilled: boolean | null
    fulfilledAt: Date | null
    fulfillmentJobId: string | null
    lastError: string | null
    retryCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TransactionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    stripePaymentId: string | null
    stripeCustomerId: string | null
    amountCents: number | null
    currency: string | null
    status: $Enums.TransactionStatus | null
    processedAt: Date | null
    idempotencyKey: string | null
    productType: $Enums.ProductType | null
    fulfilled: boolean | null
    fulfilledAt: Date | null
    fulfillmentJobId: string | null
    lastError: string | null
    retryCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TransactionCountAggregateOutputType = {
    id: number
    userId: number
    stripePaymentId: number
    stripeCustomerId: number
    amountCents: number
    currency: number
    status: number
    processedAt: number
    idempotencyKey: number
    productType: number
    productData: number
    fulfilled: number
    fulfilledAt: number
    fulfillmentJobId: number
    lastError: number
    retryCount: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TransactionAvgAggregateInputType = {
    amountCents?: true
    retryCount?: true
  }

  export type TransactionSumAggregateInputType = {
    amountCents?: true
    retryCount?: true
  }

  export type TransactionMinAggregateInputType = {
    id?: true
    userId?: true
    stripePaymentId?: true
    stripeCustomerId?: true
    amountCents?: true
    currency?: true
    status?: true
    processedAt?: true
    idempotencyKey?: true
    productType?: true
    fulfilled?: true
    fulfilledAt?: true
    fulfillmentJobId?: true
    lastError?: true
    retryCount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TransactionMaxAggregateInputType = {
    id?: true
    userId?: true
    stripePaymentId?: true
    stripeCustomerId?: true
    amountCents?: true
    currency?: true
    status?: true
    processedAt?: true
    idempotencyKey?: true
    productType?: true
    fulfilled?: true
    fulfilledAt?: true
    fulfillmentJobId?: true
    lastError?: true
    retryCount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TransactionCountAggregateInputType = {
    id?: true
    userId?: true
    stripePaymentId?: true
    stripeCustomerId?: true
    amountCents?: true
    currency?: true
    status?: true
    processedAt?: true
    idempotencyKey?: true
    productType?: true
    productData?: true
    fulfilled?: true
    fulfilledAt?: true
    fulfillmentJobId?: true
    lastError?: true
    retryCount?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TransactionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transaction to aggregate.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Transactions
    **/
    _count?: true | TransactionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TransactionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TransactionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TransactionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TransactionMaxAggregateInputType
  }

  export type GetTransactionAggregateType<T extends TransactionAggregateArgs> = {
        [P in keyof T & keyof AggregateTransaction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTransaction[P]>
      : GetScalarType<T[P], AggregateTransaction[P]>
  }




  export type TransactionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithAggregationInput | TransactionOrderByWithAggregationInput[]
    by: TransactionScalarFieldEnum[] | TransactionScalarFieldEnum
    having?: TransactionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TransactionCountAggregateInputType | true
    _avg?: TransactionAvgAggregateInputType
    _sum?: TransactionSumAggregateInputType
    _min?: TransactionMinAggregateInputType
    _max?: TransactionMaxAggregateInputType
  }

  export type TransactionGroupByOutputType = {
    id: string
    userId: string
    stripePaymentId: string
    stripeCustomerId: string | null
    amountCents: number
    currency: string
    status: $Enums.TransactionStatus
    processedAt: Date | null
    idempotencyKey: string
    productType: $Enums.ProductType
    productData: JsonValue
    fulfilled: boolean
    fulfilledAt: Date | null
    fulfillmentJobId: string | null
    lastError: string | null
    retryCount: number
    createdAt: Date
    updatedAt: Date
    _count: TransactionCountAggregateOutputType | null
    _avg: TransactionAvgAggregateOutputType | null
    _sum: TransactionSumAggregateOutputType | null
    _min: TransactionMinAggregateOutputType | null
    _max: TransactionMaxAggregateOutputType | null
  }

  type GetTransactionGroupByPayload<T extends TransactionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TransactionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TransactionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TransactionGroupByOutputType[P]>
            : GetScalarType<T[P], TransactionGroupByOutputType[P]>
        }
      >
    >


  export type TransactionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    stripePaymentId?: boolean
    stripeCustomerId?: boolean
    amountCents?: boolean
    currency?: boolean
    status?: boolean
    processedAt?: boolean
    idempotencyKey?: boolean
    productType?: boolean
    productData?: boolean
    fulfilled?: boolean
    fulfilledAt?: boolean
    fulfillmentJobId?: boolean
    lastError?: boolean
    retryCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transaction"]>

  export type TransactionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    stripePaymentId?: boolean
    stripeCustomerId?: boolean
    amountCents?: boolean
    currency?: boolean
    status?: boolean
    processedAt?: boolean
    idempotencyKey?: boolean
    productType?: boolean
    productData?: boolean
    fulfilled?: boolean
    fulfilledAt?: boolean
    fulfillmentJobId?: boolean
    lastError?: boolean
    retryCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transaction"]>

  export type TransactionSelectScalar = {
    id?: boolean
    userId?: boolean
    stripePaymentId?: boolean
    stripeCustomerId?: boolean
    amountCents?: boolean
    currency?: boolean
    status?: boolean
    processedAt?: boolean
    idempotencyKey?: boolean
    productType?: boolean
    productData?: boolean
    fulfilled?: boolean
    fulfilledAt?: boolean
    fulfillmentJobId?: boolean
    lastError?: boolean
    retryCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TransactionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type TransactionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $TransactionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Transaction"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      stripePaymentId: string
      stripeCustomerId: string | null
      amountCents: number
      currency: string
      status: $Enums.TransactionStatus
      processedAt: Date | null
      idempotencyKey: string
      productType: $Enums.ProductType
      productData: Prisma.JsonValue
      fulfilled: boolean
      fulfilledAt: Date | null
      fulfillmentJobId: string | null
      lastError: string | null
      retryCount: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["transaction"]>
    composites: {}
  }

  type TransactionGetPayload<S extends boolean | null | undefined | TransactionDefaultArgs> = $Result.GetResult<Prisma.$TransactionPayload, S>

  type TransactionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TransactionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TransactionCountAggregateInputType | true
    }

  export interface TransactionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Transaction'], meta: { name: 'Transaction' } }
    /**
     * Find zero or one Transaction that matches the filter.
     * @param {TransactionFindUniqueArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TransactionFindUniqueArgs>(args: SelectSubset<T, TransactionFindUniqueArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Transaction that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TransactionFindUniqueOrThrowArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TransactionFindUniqueOrThrowArgs>(args: SelectSubset<T, TransactionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Transaction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindFirstArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TransactionFindFirstArgs>(args?: SelectSubset<T, TransactionFindFirstArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Transaction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindFirstOrThrowArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TransactionFindFirstOrThrowArgs>(args?: SelectSubset<T, TransactionFindFirstOrThrowArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Transactions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Transactions
     * const transactions = await prisma.transaction.findMany()
     * 
     * // Get first 10 Transactions
     * const transactions = await prisma.transaction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const transactionWithIdOnly = await prisma.transaction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TransactionFindManyArgs>(args?: SelectSubset<T, TransactionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Transaction.
     * @param {TransactionCreateArgs} args - Arguments to create a Transaction.
     * @example
     * // Create one Transaction
     * const Transaction = await prisma.transaction.create({
     *   data: {
     *     // ... data to create a Transaction
     *   }
     * })
     * 
     */
    create<T extends TransactionCreateArgs>(args: SelectSubset<T, TransactionCreateArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Transactions.
     * @param {TransactionCreateManyArgs} args - Arguments to create many Transactions.
     * @example
     * // Create many Transactions
     * const transaction = await prisma.transaction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TransactionCreateManyArgs>(args?: SelectSubset<T, TransactionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Transactions and returns the data saved in the database.
     * @param {TransactionCreateManyAndReturnArgs} args - Arguments to create many Transactions.
     * @example
     * // Create many Transactions
     * const transaction = await prisma.transaction.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Transactions and only return the `id`
     * const transactionWithIdOnly = await prisma.transaction.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TransactionCreateManyAndReturnArgs>(args?: SelectSubset<T, TransactionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Transaction.
     * @param {TransactionDeleteArgs} args - Arguments to delete one Transaction.
     * @example
     * // Delete one Transaction
     * const Transaction = await prisma.transaction.delete({
     *   where: {
     *     // ... filter to delete one Transaction
     *   }
     * })
     * 
     */
    delete<T extends TransactionDeleteArgs>(args: SelectSubset<T, TransactionDeleteArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Transaction.
     * @param {TransactionUpdateArgs} args - Arguments to update one Transaction.
     * @example
     * // Update one Transaction
     * const transaction = await prisma.transaction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TransactionUpdateArgs>(args: SelectSubset<T, TransactionUpdateArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Transactions.
     * @param {TransactionDeleteManyArgs} args - Arguments to filter Transactions to delete.
     * @example
     * // Delete a few Transactions
     * const { count } = await prisma.transaction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TransactionDeleteManyArgs>(args?: SelectSubset<T, TransactionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Transactions
     * const transaction = await prisma.transaction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TransactionUpdateManyArgs>(args: SelectSubset<T, TransactionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Transaction.
     * @param {TransactionUpsertArgs} args - Arguments to update or create a Transaction.
     * @example
     * // Update or create a Transaction
     * const transaction = await prisma.transaction.upsert({
     *   create: {
     *     // ... data to create a Transaction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Transaction we want to update
     *   }
     * })
     */
    upsert<T extends TransactionUpsertArgs>(args: SelectSubset<T, TransactionUpsertArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionCountArgs} args - Arguments to filter Transactions to count.
     * @example
     * // Count the number of Transactions
     * const count = await prisma.transaction.count({
     *   where: {
     *     // ... the filter for the Transactions we want to count
     *   }
     * })
    **/
    count<T extends TransactionCountArgs>(
      args?: Subset<T, TransactionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TransactionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Transaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TransactionAggregateArgs>(args: Subset<T, TransactionAggregateArgs>): Prisma.PrismaPromise<GetTransactionAggregateType<T>>

    /**
     * Group by Transaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionGroupByArgs} args - Group by arguments.
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
      T extends TransactionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TransactionGroupByArgs['orderBy'] }
        : { orderBy?: TransactionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TransactionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTransactionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Transaction model
   */
  readonly fields: TransactionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Transaction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TransactionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the Transaction model
   */ 
  interface TransactionFieldRefs {
    readonly id: FieldRef<"Transaction", 'String'>
    readonly userId: FieldRef<"Transaction", 'String'>
    readonly stripePaymentId: FieldRef<"Transaction", 'String'>
    readonly stripeCustomerId: FieldRef<"Transaction", 'String'>
    readonly amountCents: FieldRef<"Transaction", 'Int'>
    readonly currency: FieldRef<"Transaction", 'String'>
    readonly status: FieldRef<"Transaction", 'TransactionStatus'>
    readonly processedAt: FieldRef<"Transaction", 'DateTime'>
    readonly idempotencyKey: FieldRef<"Transaction", 'String'>
    readonly productType: FieldRef<"Transaction", 'ProductType'>
    readonly productData: FieldRef<"Transaction", 'Json'>
    readonly fulfilled: FieldRef<"Transaction", 'Boolean'>
    readonly fulfilledAt: FieldRef<"Transaction", 'DateTime'>
    readonly fulfillmentJobId: FieldRef<"Transaction", 'String'>
    readonly lastError: FieldRef<"Transaction", 'String'>
    readonly retryCount: FieldRef<"Transaction", 'Int'>
    readonly createdAt: FieldRef<"Transaction", 'DateTime'>
    readonly updatedAt: FieldRef<"Transaction", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Transaction findUnique
   */
  export type TransactionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction findUniqueOrThrow
   */
  export type TransactionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction findFirst
   */
  export type TransactionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction findFirstOrThrow
   */
  export type TransactionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction findMany
   */
  export type TransactionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transactions to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction create
   */
  export type TransactionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The data needed to create a Transaction.
     */
    data: XOR<TransactionCreateInput, TransactionUncheckedCreateInput>
  }

  /**
   * Transaction createMany
   */
  export type TransactionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Transactions.
     */
    data: TransactionCreateManyInput | TransactionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Transaction createManyAndReturn
   */
  export type TransactionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Transactions.
     */
    data: TransactionCreateManyInput | TransactionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Transaction update
   */
  export type TransactionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The data needed to update a Transaction.
     */
    data: XOR<TransactionUpdateInput, TransactionUncheckedUpdateInput>
    /**
     * Choose, which Transaction to update.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction updateMany
   */
  export type TransactionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Transactions.
     */
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyInput>
    /**
     * Filter which Transactions to update
     */
    where?: TransactionWhereInput
  }

  /**
   * Transaction upsert
   */
  export type TransactionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The filter to search for the Transaction to update in case it exists.
     */
    where: TransactionWhereUniqueInput
    /**
     * In case the Transaction found by the `where` argument doesn't exist, create a new Transaction with this data.
     */
    create: XOR<TransactionCreateInput, TransactionUncheckedCreateInput>
    /**
     * In case the Transaction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TransactionUpdateInput, TransactionUncheckedUpdateInput>
  }

  /**
   * Transaction delete
   */
  export type TransactionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter which Transaction to delete.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction deleteMany
   */
  export type TransactionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transactions to delete
     */
    where?: TransactionWhereInput
  }

  /**
   * Transaction without action
   */
  export type TransactionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
  }


  /**
   * Model Achievement
   */

  export type AggregateAchievement = {
    _count: AchievementCountAggregateOutputType | null
    _avg: AchievementAvgAggregateOutputType | null
    _sum: AchievementSumAggregateOutputType | null
    _min: AchievementMinAggregateOutputType | null
    _max: AchievementMaxAggregateOutputType | null
  }

  export type AchievementAvgAggregateOutputType = {
    conditionValue: Decimal | null
    rewardLoC: Decimal | null
    rewardExp: Decimal | null
    points: number | null
  }

  export type AchievementSumAggregateOutputType = {
    conditionValue: Decimal | null
    rewardLoC: Decimal | null
    rewardExp: Decimal | null
    points: number | null
  }

  export type AchievementMinAggregateOutputType = {
    id: string | null
    slug: string | null
    name: string | null
    description: string | null
    conditionType: $Enums.AchievementCondition | null
    conditionValue: Decimal | null
    rewardLoC: Decimal | null
    rewardExp: Decimal | null
    rewardItemSlug: string | null
    iconUrl: string | null
    points: number | null
    hidden: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AchievementMaxAggregateOutputType = {
    id: string | null
    slug: string | null
    name: string | null
    description: string | null
    conditionType: $Enums.AchievementCondition | null
    conditionValue: Decimal | null
    rewardLoC: Decimal | null
    rewardExp: Decimal | null
    rewardItemSlug: string | null
    iconUrl: string | null
    points: number | null
    hidden: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AchievementCountAggregateOutputType = {
    id: number
    slug: number
    name: number
    description: number
    conditionType: number
    conditionValue: number
    rewardLoC: number
    rewardExp: number
    rewardItemSlug: number
    iconUrl: number
    points: number
    hidden: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AchievementAvgAggregateInputType = {
    conditionValue?: true
    rewardLoC?: true
    rewardExp?: true
    points?: true
  }

  export type AchievementSumAggregateInputType = {
    conditionValue?: true
    rewardLoC?: true
    rewardExp?: true
    points?: true
  }

  export type AchievementMinAggregateInputType = {
    id?: true
    slug?: true
    name?: true
    description?: true
    conditionType?: true
    conditionValue?: true
    rewardLoC?: true
    rewardExp?: true
    rewardItemSlug?: true
    iconUrl?: true
    points?: true
    hidden?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AchievementMaxAggregateInputType = {
    id?: true
    slug?: true
    name?: true
    description?: true
    conditionType?: true
    conditionValue?: true
    rewardLoC?: true
    rewardExp?: true
    rewardItemSlug?: true
    iconUrl?: true
    points?: true
    hidden?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AchievementCountAggregateInputType = {
    id?: true
    slug?: true
    name?: true
    description?: true
    conditionType?: true
    conditionValue?: true
    rewardLoC?: true
    rewardExp?: true
    rewardItemSlug?: true
    iconUrl?: true
    points?: true
    hidden?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AchievementAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Achievement to aggregate.
     */
    where?: AchievementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Achievements to fetch.
     */
    orderBy?: AchievementOrderByWithRelationInput | AchievementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AchievementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Achievements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Achievements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Achievements
    **/
    _count?: true | AchievementCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AchievementAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AchievementSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AchievementMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AchievementMaxAggregateInputType
  }

  export type GetAchievementAggregateType<T extends AchievementAggregateArgs> = {
        [P in keyof T & keyof AggregateAchievement]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAchievement[P]>
      : GetScalarType<T[P], AggregateAchievement[P]>
  }




  export type AchievementGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AchievementWhereInput
    orderBy?: AchievementOrderByWithAggregationInput | AchievementOrderByWithAggregationInput[]
    by: AchievementScalarFieldEnum[] | AchievementScalarFieldEnum
    having?: AchievementScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AchievementCountAggregateInputType | true
    _avg?: AchievementAvgAggregateInputType
    _sum?: AchievementSumAggregateInputType
    _min?: AchievementMinAggregateInputType
    _max?: AchievementMaxAggregateInputType
  }

  export type AchievementGroupByOutputType = {
    id: string
    slug: string
    name: string
    description: string
    conditionType: $Enums.AchievementCondition
    conditionValue: Decimal
    rewardLoC: Decimal | null
    rewardExp: Decimal | null
    rewardItemSlug: string | null
    iconUrl: string | null
    points: number
    hidden: boolean
    createdAt: Date
    updatedAt: Date
    _count: AchievementCountAggregateOutputType | null
    _avg: AchievementAvgAggregateOutputType | null
    _sum: AchievementSumAggregateOutputType | null
    _min: AchievementMinAggregateOutputType | null
    _max: AchievementMaxAggregateOutputType | null
  }

  type GetAchievementGroupByPayload<T extends AchievementGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AchievementGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AchievementGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AchievementGroupByOutputType[P]>
            : GetScalarType<T[P], AchievementGroupByOutputType[P]>
        }
      >
    >


  export type AchievementSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    name?: boolean
    description?: boolean
    conditionType?: boolean
    conditionValue?: boolean
    rewardLoC?: boolean
    rewardExp?: boolean
    rewardItemSlug?: boolean
    iconUrl?: boolean
    points?: boolean
    hidden?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userAchievements?: boolean | Achievement$userAchievementsArgs<ExtArgs>
    _count?: boolean | AchievementCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["achievement"]>

  export type AchievementSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    name?: boolean
    description?: boolean
    conditionType?: boolean
    conditionValue?: boolean
    rewardLoC?: boolean
    rewardExp?: boolean
    rewardItemSlug?: boolean
    iconUrl?: boolean
    points?: boolean
    hidden?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["achievement"]>

  export type AchievementSelectScalar = {
    id?: boolean
    slug?: boolean
    name?: boolean
    description?: boolean
    conditionType?: boolean
    conditionValue?: boolean
    rewardLoC?: boolean
    rewardExp?: boolean
    rewardItemSlug?: boolean
    iconUrl?: boolean
    points?: boolean
    hidden?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AchievementInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userAchievements?: boolean | Achievement$userAchievementsArgs<ExtArgs>
    _count?: boolean | AchievementCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AchievementIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $AchievementPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Achievement"
    objects: {
      userAchievements: Prisma.$UserAchievementPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      slug: string
      name: string
      description: string
      conditionType: $Enums.AchievementCondition
      conditionValue: Prisma.Decimal
      rewardLoC: Prisma.Decimal | null
      rewardExp: Prisma.Decimal | null
      rewardItemSlug: string | null
      iconUrl: string | null
      points: number
      hidden: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["achievement"]>
    composites: {}
  }

  type AchievementGetPayload<S extends boolean | null | undefined | AchievementDefaultArgs> = $Result.GetResult<Prisma.$AchievementPayload, S>

  type AchievementCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AchievementFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AchievementCountAggregateInputType | true
    }

  export interface AchievementDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Achievement'], meta: { name: 'Achievement' } }
    /**
     * Find zero or one Achievement that matches the filter.
     * @param {AchievementFindUniqueArgs} args - Arguments to find a Achievement
     * @example
     * // Get one Achievement
     * const achievement = await prisma.achievement.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AchievementFindUniqueArgs>(args: SelectSubset<T, AchievementFindUniqueArgs<ExtArgs>>): Prisma__AchievementClient<$Result.GetResult<Prisma.$AchievementPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Achievement that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AchievementFindUniqueOrThrowArgs} args - Arguments to find a Achievement
     * @example
     * // Get one Achievement
     * const achievement = await prisma.achievement.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AchievementFindUniqueOrThrowArgs>(args: SelectSubset<T, AchievementFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AchievementClient<$Result.GetResult<Prisma.$AchievementPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Achievement that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AchievementFindFirstArgs} args - Arguments to find a Achievement
     * @example
     * // Get one Achievement
     * const achievement = await prisma.achievement.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AchievementFindFirstArgs>(args?: SelectSubset<T, AchievementFindFirstArgs<ExtArgs>>): Prisma__AchievementClient<$Result.GetResult<Prisma.$AchievementPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Achievement that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AchievementFindFirstOrThrowArgs} args - Arguments to find a Achievement
     * @example
     * // Get one Achievement
     * const achievement = await prisma.achievement.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AchievementFindFirstOrThrowArgs>(args?: SelectSubset<T, AchievementFindFirstOrThrowArgs<ExtArgs>>): Prisma__AchievementClient<$Result.GetResult<Prisma.$AchievementPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Achievements that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AchievementFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Achievements
     * const achievements = await prisma.achievement.findMany()
     * 
     * // Get first 10 Achievements
     * const achievements = await prisma.achievement.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const achievementWithIdOnly = await prisma.achievement.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AchievementFindManyArgs>(args?: SelectSubset<T, AchievementFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AchievementPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Achievement.
     * @param {AchievementCreateArgs} args - Arguments to create a Achievement.
     * @example
     * // Create one Achievement
     * const Achievement = await prisma.achievement.create({
     *   data: {
     *     // ... data to create a Achievement
     *   }
     * })
     * 
     */
    create<T extends AchievementCreateArgs>(args: SelectSubset<T, AchievementCreateArgs<ExtArgs>>): Prisma__AchievementClient<$Result.GetResult<Prisma.$AchievementPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Achievements.
     * @param {AchievementCreateManyArgs} args - Arguments to create many Achievements.
     * @example
     * // Create many Achievements
     * const achievement = await prisma.achievement.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AchievementCreateManyArgs>(args?: SelectSubset<T, AchievementCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Achievements and returns the data saved in the database.
     * @param {AchievementCreateManyAndReturnArgs} args - Arguments to create many Achievements.
     * @example
     * // Create many Achievements
     * const achievement = await prisma.achievement.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Achievements and only return the `id`
     * const achievementWithIdOnly = await prisma.achievement.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AchievementCreateManyAndReturnArgs>(args?: SelectSubset<T, AchievementCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AchievementPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Achievement.
     * @param {AchievementDeleteArgs} args - Arguments to delete one Achievement.
     * @example
     * // Delete one Achievement
     * const Achievement = await prisma.achievement.delete({
     *   where: {
     *     // ... filter to delete one Achievement
     *   }
     * })
     * 
     */
    delete<T extends AchievementDeleteArgs>(args: SelectSubset<T, AchievementDeleteArgs<ExtArgs>>): Prisma__AchievementClient<$Result.GetResult<Prisma.$AchievementPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Achievement.
     * @param {AchievementUpdateArgs} args - Arguments to update one Achievement.
     * @example
     * // Update one Achievement
     * const achievement = await prisma.achievement.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AchievementUpdateArgs>(args: SelectSubset<T, AchievementUpdateArgs<ExtArgs>>): Prisma__AchievementClient<$Result.GetResult<Prisma.$AchievementPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Achievements.
     * @param {AchievementDeleteManyArgs} args - Arguments to filter Achievements to delete.
     * @example
     * // Delete a few Achievements
     * const { count } = await prisma.achievement.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AchievementDeleteManyArgs>(args?: SelectSubset<T, AchievementDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Achievements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AchievementUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Achievements
     * const achievement = await prisma.achievement.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AchievementUpdateManyArgs>(args: SelectSubset<T, AchievementUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Achievement.
     * @param {AchievementUpsertArgs} args - Arguments to update or create a Achievement.
     * @example
     * // Update or create a Achievement
     * const achievement = await prisma.achievement.upsert({
     *   create: {
     *     // ... data to create a Achievement
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Achievement we want to update
     *   }
     * })
     */
    upsert<T extends AchievementUpsertArgs>(args: SelectSubset<T, AchievementUpsertArgs<ExtArgs>>): Prisma__AchievementClient<$Result.GetResult<Prisma.$AchievementPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Achievements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AchievementCountArgs} args - Arguments to filter Achievements to count.
     * @example
     * // Count the number of Achievements
     * const count = await prisma.achievement.count({
     *   where: {
     *     // ... the filter for the Achievements we want to count
     *   }
     * })
    **/
    count<T extends AchievementCountArgs>(
      args?: Subset<T, AchievementCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AchievementCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Achievement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AchievementAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AchievementAggregateArgs>(args: Subset<T, AchievementAggregateArgs>): Prisma.PrismaPromise<GetAchievementAggregateType<T>>

    /**
     * Group by Achievement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AchievementGroupByArgs} args - Group by arguments.
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
      T extends AchievementGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AchievementGroupByArgs['orderBy'] }
        : { orderBy?: AchievementGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AchievementGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAchievementGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Achievement model
   */
  readonly fields: AchievementFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Achievement.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AchievementClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    userAchievements<T extends Achievement$userAchievementsArgs<ExtArgs> = {}>(args?: Subset<T, Achievement$userAchievementsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserAchievementPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the Achievement model
   */ 
  interface AchievementFieldRefs {
    readonly id: FieldRef<"Achievement", 'String'>
    readonly slug: FieldRef<"Achievement", 'String'>
    readonly name: FieldRef<"Achievement", 'String'>
    readonly description: FieldRef<"Achievement", 'String'>
    readonly conditionType: FieldRef<"Achievement", 'AchievementCondition'>
    readonly conditionValue: FieldRef<"Achievement", 'Decimal'>
    readonly rewardLoC: FieldRef<"Achievement", 'Decimal'>
    readonly rewardExp: FieldRef<"Achievement", 'Decimal'>
    readonly rewardItemSlug: FieldRef<"Achievement", 'String'>
    readonly iconUrl: FieldRef<"Achievement", 'String'>
    readonly points: FieldRef<"Achievement", 'Int'>
    readonly hidden: FieldRef<"Achievement", 'Boolean'>
    readonly createdAt: FieldRef<"Achievement", 'DateTime'>
    readonly updatedAt: FieldRef<"Achievement", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Achievement findUnique
   */
  export type AchievementFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Achievement
     */
    select?: AchievementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AchievementInclude<ExtArgs> | null
    /**
     * Filter, which Achievement to fetch.
     */
    where: AchievementWhereUniqueInput
  }

  /**
   * Achievement findUniqueOrThrow
   */
  export type AchievementFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Achievement
     */
    select?: AchievementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AchievementInclude<ExtArgs> | null
    /**
     * Filter, which Achievement to fetch.
     */
    where: AchievementWhereUniqueInput
  }

  /**
   * Achievement findFirst
   */
  export type AchievementFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Achievement
     */
    select?: AchievementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AchievementInclude<ExtArgs> | null
    /**
     * Filter, which Achievement to fetch.
     */
    where?: AchievementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Achievements to fetch.
     */
    orderBy?: AchievementOrderByWithRelationInput | AchievementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Achievements.
     */
    cursor?: AchievementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Achievements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Achievements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Achievements.
     */
    distinct?: AchievementScalarFieldEnum | AchievementScalarFieldEnum[]
  }

  /**
   * Achievement findFirstOrThrow
   */
  export type AchievementFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Achievement
     */
    select?: AchievementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AchievementInclude<ExtArgs> | null
    /**
     * Filter, which Achievement to fetch.
     */
    where?: AchievementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Achievements to fetch.
     */
    orderBy?: AchievementOrderByWithRelationInput | AchievementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Achievements.
     */
    cursor?: AchievementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Achievements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Achievements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Achievements.
     */
    distinct?: AchievementScalarFieldEnum | AchievementScalarFieldEnum[]
  }

  /**
   * Achievement findMany
   */
  export type AchievementFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Achievement
     */
    select?: AchievementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AchievementInclude<ExtArgs> | null
    /**
     * Filter, which Achievements to fetch.
     */
    where?: AchievementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Achievements to fetch.
     */
    orderBy?: AchievementOrderByWithRelationInput | AchievementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Achievements.
     */
    cursor?: AchievementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Achievements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Achievements.
     */
    skip?: number
    distinct?: AchievementScalarFieldEnum | AchievementScalarFieldEnum[]
  }

  /**
   * Achievement create
   */
  export type AchievementCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Achievement
     */
    select?: AchievementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AchievementInclude<ExtArgs> | null
    /**
     * The data needed to create a Achievement.
     */
    data: XOR<AchievementCreateInput, AchievementUncheckedCreateInput>
  }

  /**
   * Achievement createMany
   */
  export type AchievementCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Achievements.
     */
    data: AchievementCreateManyInput | AchievementCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Achievement createManyAndReturn
   */
  export type AchievementCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Achievement
     */
    select?: AchievementSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Achievements.
     */
    data: AchievementCreateManyInput | AchievementCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Achievement update
   */
  export type AchievementUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Achievement
     */
    select?: AchievementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AchievementInclude<ExtArgs> | null
    /**
     * The data needed to update a Achievement.
     */
    data: XOR<AchievementUpdateInput, AchievementUncheckedUpdateInput>
    /**
     * Choose, which Achievement to update.
     */
    where: AchievementWhereUniqueInput
  }

  /**
   * Achievement updateMany
   */
  export type AchievementUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Achievements.
     */
    data: XOR<AchievementUpdateManyMutationInput, AchievementUncheckedUpdateManyInput>
    /**
     * Filter which Achievements to update
     */
    where?: AchievementWhereInput
  }

  /**
   * Achievement upsert
   */
  export type AchievementUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Achievement
     */
    select?: AchievementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AchievementInclude<ExtArgs> | null
    /**
     * The filter to search for the Achievement to update in case it exists.
     */
    where: AchievementWhereUniqueInput
    /**
     * In case the Achievement found by the `where` argument doesn't exist, create a new Achievement with this data.
     */
    create: XOR<AchievementCreateInput, AchievementUncheckedCreateInput>
    /**
     * In case the Achievement was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AchievementUpdateInput, AchievementUncheckedUpdateInput>
  }

  /**
   * Achievement delete
   */
  export type AchievementDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Achievement
     */
    select?: AchievementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AchievementInclude<ExtArgs> | null
    /**
     * Filter which Achievement to delete.
     */
    where: AchievementWhereUniqueInput
  }

  /**
   * Achievement deleteMany
   */
  export type AchievementDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Achievements to delete
     */
    where?: AchievementWhereInput
  }

  /**
   * Achievement.userAchievements
   */
  export type Achievement$userAchievementsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAchievement
     */
    select?: UserAchievementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAchievementInclude<ExtArgs> | null
    where?: UserAchievementWhereInput
    orderBy?: UserAchievementOrderByWithRelationInput | UserAchievementOrderByWithRelationInput[]
    cursor?: UserAchievementWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserAchievementScalarFieldEnum | UserAchievementScalarFieldEnum[]
  }

  /**
   * Achievement without action
   */
  export type AchievementDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Achievement
     */
    select?: AchievementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AchievementInclude<ExtArgs> | null
  }


  /**
   * Model UserAchievement
   */

  export type AggregateUserAchievement = {
    _count: UserAchievementCountAggregateOutputType | null
    _min: UserAchievementMinAggregateOutputType | null
    _max: UserAchievementMaxAggregateOutputType | null
  }

  export type UserAchievementMinAggregateOutputType = {
    id: string | null
    userId: string | null
    achievementId: string | null
    unlockedAt: Date | null
    claimed: boolean | null
    claimedAt: Date | null
  }

  export type UserAchievementMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    achievementId: string | null
    unlockedAt: Date | null
    claimed: boolean | null
    claimedAt: Date | null
  }

  export type UserAchievementCountAggregateOutputType = {
    id: number
    userId: number
    achievementId: number
    unlockedAt: number
    claimed: number
    claimedAt: number
    _all: number
  }


  export type UserAchievementMinAggregateInputType = {
    id?: true
    userId?: true
    achievementId?: true
    unlockedAt?: true
    claimed?: true
    claimedAt?: true
  }

  export type UserAchievementMaxAggregateInputType = {
    id?: true
    userId?: true
    achievementId?: true
    unlockedAt?: true
    claimed?: true
    claimedAt?: true
  }

  export type UserAchievementCountAggregateInputType = {
    id?: true
    userId?: true
    achievementId?: true
    unlockedAt?: true
    claimed?: true
    claimedAt?: true
    _all?: true
  }

  export type UserAchievementAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserAchievement to aggregate.
     */
    where?: UserAchievementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserAchievements to fetch.
     */
    orderBy?: UserAchievementOrderByWithRelationInput | UserAchievementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserAchievementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserAchievements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserAchievements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserAchievements
    **/
    _count?: true | UserAchievementCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserAchievementMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserAchievementMaxAggregateInputType
  }

  export type GetUserAchievementAggregateType<T extends UserAchievementAggregateArgs> = {
        [P in keyof T & keyof AggregateUserAchievement]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserAchievement[P]>
      : GetScalarType<T[P], AggregateUserAchievement[P]>
  }




  export type UserAchievementGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserAchievementWhereInput
    orderBy?: UserAchievementOrderByWithAggregationInput | UserAchievementOrderByWithAggregationInput[]
    by: UserAchievementScalarFieldEnum[] | UserAchievementScalarFieldEnum
    having?: UserAchievementScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserAchievementCountAggregateInputType | true
    _min?: UserAchievementMinAggregateInputType
    _max?: UserAchievementMaxAggregateInputType
  }

  export type UserAchievementGroupByOutputType = {
    id: string
    userId: string
    achievementId: string
    unlockedAt: Date
    claimed: boolean
    claimedAt: Date | null
    _count: UserAchievementCountAggregateOutputType | null
    _min: UserAchievementMinAggregateOutputType | null
    _max: UserAchievementMaxAggregateOutputType | null
  }

  type GetUserAchievementGroupByPayload<T extends UserAchievementGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserAchievementGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserAchievementGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserAchievementGroupByOutputType[P]>
            : GetScalarType<T[P], UserAchievementGroupByOutputType[P]>
        }
      >
    >


  export type UserAchievementSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    achievementId?: boolean
    unlockedAt?: boolean
    claimed?: boolean
    claimedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    achievement?: boolean | AchievementDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userAchievement"]>

  export type UserAchievementSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    achievementId?: boolean
    unlockedAt?: boolean
    claimed?: boolean
    claimedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    achievement?: boolean | AchievementDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userAchievement"]>

  export type UserAchievementSelectScalar = {
    id?: boolean
    userId?: boolean
    achievementId?: boolean
    unlockedAt?: boolean
    claimed?: boolean
    claimedAt?: boolean
  }

  export type UserAchievementInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    achievement?: boolean | AchievementDefaultArgs<ExtArgs>
  }
  export type UserAchievementIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    achievement?: boolean | AchievementDefaultArgs<ExtArgs>
  }

  export type $UserAchievementPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserAchievement"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      achievement: Prisma.$AchievementPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      achievementId: string
      unlockedAt: Date
      claimed: boolean
      claimedAt: Date | null
    }, ExtArgs["result"]["userAchievement"]>
    composites: {}
  }

  type UserAchievementGetPayload<S extends boolean | null | undefined | UserAchievementDefaultArgs> = $Result.GetResult<Prisma.$UserAchievementPayload, S>

  type UserAchievementCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserAchievementFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserAchievementCountAggregateInputType | true
    }

  export interface UserAchievementDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserAchievement'], meta: { name: 'UserAchievement' } }
    /**
     * Find zero or one UserAchievement that matches the filter.
     * @param {UserAchievementFindUniqueArgs} args - Arguments to find a UserAchievement
     * @example
     * // Get one UserAchievement
     * const userAchievement = await prisma.userAchievement.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserAchievementFindUniqueArgs>(args: SelectSubset<T, UserAchievementFindUniqueArgs<ExtArgs>>): Prisma__UserAchievementClient<$Result.GetResult<Prisma.$UserAchievementPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one UserAchievement that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserAchievementFindUniqueOrThrowArgs} args - Arguments to find a UserAchievement
     * @example
     * // Get one UserAchievement
     * const userAchievement = await prisma.userAchievement.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserAchievementFindUniqueOrThrowArgs>(args: SelectSubset<T, UserAchievementFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserAchievementClient<$Result.GetResult<Prisma.$UserAchievementPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first UserAchievement that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAchievementFindFirstArgs} args - Arguments to find a UserAchievement
     * @example
     * // Get one UserAchievement
     * const userAchievement = await prisma.userAchievement.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserAchievementFindFirstArgs>(args?: SelectSubset<T, UserAchievementFindFirstArgs<ExtArgs>>): Prisma__UserAchievementClient<$Result.GetResult<Prisma.$UserAchievementPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first UserAchievement that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAchievementFindFirstOrThrowArgs} args - Arguments to find a UserAchievement
     * @example
     * // Get one UserAchievement
     * const userAchievement = await prisma.userAchievement.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserAchievementFindFirstOrThrowArgs>(args?: SelectSubset<T, UserAchievementFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserAchievementClient<$Result.GetResult<Prisma.$UserAchievementPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more UserAchievements that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAchievementFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserAchievements
     * const userAchievements = await prisma.userAchievement.findMany()
     * 
     * // Get first 10 UserAchievements
     * const userAchievements = await prisma.userAchievement.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userAchievementWithIdOnly = await prisma.userAchievement.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserAchievementFindManyArgs>(args?: SelectSubset<T, UserAchievementFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserAchievementPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a UserAchievement.
     * @param {UserAchievementCreateArgs} args - Arguments to create a UserAchievement.
     * @example
     * // Create one UserAchievement
     * const UserAchievement = await prisma.userAchievement.create({
     *   data: {
     *     // ... data to create a UserAchievement
     *   }
     * })
     * 
     */
    create<T extends UserAchievementCreateArgs>(args: SelectSubset<T, UserAchievementCreateArgs<ExtArgs>>): Prisma__UserAchievementClient<$Result.GetResult<Prisma.$UserAchievementPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many UserAchievements.
     * @param {UserAchievementCreateManyArgs} args - Arguments to create many UserAchievements.
     * @example
     * // Create many UserAchievements
     * const userAchievement = await prisma.userAchievement.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserAchievementCreateManyArgs>(args?: SelectSubset<T, UserAchievementCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserAchievements and returns the data saved in the database.
     * @param {UserAchievementCreateManyAndReturnArgs} args - Arguments to create many UserAchievements.
     * @example
     * // Create many UserAchievements
     * const userAchievement = await prisma.userAchievement.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserAchievements and only return the `id`
     * const userAchievementWithIdOnly = await prisma.userAchievement.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserAchievementCreateManyAndReturnArgs>(args?: SelectSubset<T, UserAchievementCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserAchievementPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a UserAchievement.
     * @param {UserAchievementDeleteArgs} args - Arguments to delete one UserAchievement.
     * @example
     * // Delete one UserAchievement
     * const UserAchievement = await prisma.userAchievement.delete({
     *   where: {
     *     // ... filter to delete one UserAchievement
     *   }
     * })
     * 
     */
    delete<T extends UserAchievementDeleteArgs>(args: SelectSubset<T, UserAchievementDeleteArgs<ExtArgs>>): Prisma__UserAchievementClient<$Result.GetResult<Prisma.$UserAchievementPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one UserAchievement.
     * @param {UserAchievementUpdateArgs} args - Arguments to update one UserAchievement.
     * @example
     * // Update one UserAchievement
     * const userAchievement = await prisma.userAchievement.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserAchievementUpdateArgs>(args: SelectSubset<T, UserAchievementUpdateArgs<ExtArgs>>): Prisma__UserAchievementClient<$Result.GetResult<Prisma.$UserAchievementPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more UserAchievements.
     * @param {UserAchievementDeleteManyArgs} args - Arguments to filter UserAchievements to delete.
     * @example
     * // Delete a few UserAchievements
     * const { count } = await prisma.userAchievement.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserAchievementDeleteManyArgs>(args?: SelectSubset<T, UserAchievementDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserAchievements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAchievementUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserAchievements
     * const userAchievement = await prisma.userAchievement.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserAchievementUpdateManyArgs>(args: SelectSubset<T, UserAchievementUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one UserAchievement.
     * @param {UserAchievementUpsertArgs} args - Arguments to update or create a UserAchievement.
     * @example
     * // Update or create a UserAchievement
     * const userAchievement = await prisma.userAchievement.upsert({
     *   create: {
     *     // ... data to create a UserAchievement
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserAchievement we want to update
     *   }
     * })
     */
    upsert<T extends UserAchievementUpsertArgs>(args: SelectSubset<T, UserAchievementUpsertArgs<ExtArgs>>): Prisma__UserAchievementClient<$Result.GetResult<Prisma.$UserAchievementPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of UserAchievements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAchievementCountArgs} args - Arguments to filter UserAchievements to count.
     * @example
     * // Count the number of UserAchievements
     * const count = await prisma.userAchievement.count({
     *   where: {
     *     // ... the filter for the UserAchievements we want to count
     *   }
     * })
    **/
    count<T extends UserAchievementCountArgs>(
      args?: Subset<T, UserAchievementCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserAchievementCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserAchievement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAchievementAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserAchievementAggregateArgs>(args: Subset<T, UserAchievementAggregateArgs>): Prisma.PrismaPromise<GetUserAchievementAggregateType<T>>

    /**
     * Group by UserAchievement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAchievementGroupByArgs} args - Group by arguments.
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
      T extends UserAchievementGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserAchievementGroupByArgs['orderBy'] }
        : { orderBy?: UserAchievementGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserAchievementGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserAchievementGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserAchievement model
   */
  readonly fields: UserAchievementFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserAchievement.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserAchievementClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    achievement<T extends AchievementDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AchievementDefaultArgs<ExtArgs>>): Prisma__AchievementClient<$Result.GetResult<Prisma.$AchievementPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the UserAchievement model
   */ 
  interface UserAchievementFieldRefs {
    readonly id: FieldRef<"UserAchievement", 'String'>
    readonly userId: FieldRef<"UserAchievement", 'String'>
    readonly achievementId: FieldRef<"UserAchievement", 'String'>
    readonly unlockedAt: FieldRef<"UserAchievement", 'DateTime'>
    readonly claimed: FieldRef<"UserAchievement", 'Boolean'>
    readonly claimedAt: FieldRef<"UserAchievement", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserAchievement findUnique
   */
  export type UserAchievementFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAchievement
     */
    select?: UserAchievementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAchievementInclude<ExtArgs> | null
    /**
     * Filter, which UserAchievement to fetch.
     */
    where: UserAchievementWhereUniqueInput
  }

  /**
   * UserAchievement findUniqueOrThrow
   */
  export type UserAchievementFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAchievement
     */
    select?: UserAchievementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAchievementInclude<ExtArgs> | null
    /**
     * Filter, which UserAchievement to fetch.
     */
    where: UserAchievementWhereUniqueInput
  }

  /**
   * UserAchievement findFirst
   */
  export type UserAchievementFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAchievement
     */
    select?: UserAchievementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAchievementInclude<ExtArgs> | null
    /**
     * Filter, which UserAchievement to fetch.
     */
    where?: UserAchievementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserAchievements to fetch.
     */
    orderBy?: UserAchievementOrderByWithRelationInput | UserAchievementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserAchievements.
     */
    cursor?: UserAchievementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserAchievements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserAchievements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserAchievements.
     */
    distinct?: UserAchievementScalarFieldEnum | UserAchievementScalarFieldEnum[]
  }

  /**
   * UserAchievement findFirstOrThrow
   */
  export type UserAchievementFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAchievement
     */
    select?: UserAchievementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAchievementInclude<ExtArgs> | null
    /**
     * Filter, which UserAchievement to fetch.
     */
    where?: UserAchievementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserAchievements to fetch.
     */
    orderBy?: UserAchievementOrderByWithRelationInput | UserAchievementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserAchievements.
     */
    cursor?: UserAchievementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserAchievements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserAchievements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserAchievements.
     */
    distinct?: UserAchievementScalarFieldEnum | UserAchievementScalarFieldEnum[]
  }

  /**
   * UserAchievement findMany
   */
  export type UserAchievementFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAchievement
     */
    select?: UserAchievementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAchievementInclude<ExtArgs> | null
    /**
     * Filter, which UserAchievements to fetch.
     */
    where?: UserAchievementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserAchievements to fetch.
     */
    orderBy?: UserAchievementOrderByWithRelationInput | UserAchievementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserAchievements.
     */
    cursor?: UserAchievementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserAchievements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserAchievements.
     */
    skip?: number
    distinct?: UserAchievementScalarFieldEnum | UserAchievementScalarFieldEnum[]
  }

  /**
   * UserAchievement create
   */
  export type UserAchievementCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAchievement
     */
    select?: UserAchievementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAchievementInclude<ExtArgs> | null
    /**
     * The data needed to create a UserAchievement.
     */
    data: XOR<UserAchievementCreateInput, UserAchievementUncheckedCreateInput>
  }

  /**
   * UserAchievement createMany
   */
  export type UserAchievementCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserAchievements.
     */
    data: UserAchievementCreateManyInput | UserAchievementCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserAchievement createManyAndReturn
   */
  export type UserAchievementCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAchievement
     */
    select?: UserAchievementSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many UserAchievements.
     */
    data: UserAchievementCreateManyInput | UserAchievementCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAchievementIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserAchievement update
   */
  export type UserAchievementUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAchievement
     */
    select?: UserAchievementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAchievementInclude<ExtArgs> | null
    /**
     * The data needed to update a UserAchievement.
     */
    data: XOR<UserAchievementUpdateInput, UserAchievementUncheckedUpdateInput>
    /**
     * Choose, which UserAchievement to update.
     */
    where: UserAchievementWhereUniqueInput
  }

  /**
   * UserAchievement updateMany
   */
  export type UserAchievementUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserAchievements.
     */
    data: XOR<UserAchievementUpdateManyMutationInput, UserAchievementUncheckedUpdateManyInput>
    /**
     * Filter which UserAchievements to update
     */
    where?: UserAchievementWhereInput
  }

  /**
   * UserAchievement upsert
   */
  export type UserAchievementUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAchievement
     */
    select?: UserAchievementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAchievementInclude<ExtArgs> | null
    /**
     * The filter to search for the UserAchievement to update in case it exists.
     */
    where: UserAchievementWhereUniqueInput
    /**
     * In case the UserAchievement found by the `where` argument doesn't exist, create a new UserAchievement with this data.
     */
    create: XOR<UserAchievementCreateInput, UserAchievementUncheckedCreateInput>
    /**
     * In case the UserAchievement was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserAchievementUpdateInput, UserAchievementUncheckedUpdateInput>
  }

  /**
   * UserAchievement delete
   */
  export type UserAchievementDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAchievement
     */
    select?: UserAchievementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAchievementInclude<ExtArgs> | null
    /**
     * Filter which UserAchievement to delete.
     */
    where: UserAchievementWhereUniqueInput
  }

  /**
   * UserAchievement deleteMany
   */
  export type UserAchievementDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserAchievements to delete
     */
    where?: UserAchievementWhereInput
  }

  /**
   * UserAchievement without action
   */
  export type UserAchievementDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAchievement
     */
    select?: UserAchievementSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAchievementInclude<ExtArgs> | null
  }


  /**
   * Model OfflineSession
   */

  export type AggregateOfflineSession = {
    _count: OfflineSessionCountAggregateOutputType | null
    _avg: OfflineSessionAvgAggregateOutputType | null
    _sum: OfflineSessionSumAggregateOutputType | null
    _min: OfflineSessionMinAggregateOutputType | null
    _max: OfflineSessionMaxAggregateOutputType | null
  }

  export type OfflineSessionAvgAggregateOutputType = {
    earnedLoC: Decimal | null
    earnedExp: Decimal | null
  }

  export type OfflineSessionSumAggregateOutputType = {
    earnedLoC: Decimal | null
    earnedExp: Decimal | null
  }

  export type OfflineSessionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    disconnectedAt: Date | null
    reconnectedAt: Date | null
    earnedLoC: Decimal | null
    earnedExp: Decimal | null
    processed: boolean | null
    createdAt: Date | null
  }

  export type OfflineSessionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    disconnectedAt: Date | null
    reconnectedAt: Date | null
    earnedLoC: Decimal | null
    earnedExp: Decimal | null
    processed: boolean | null
    createdAt: Date | null
  }

  export type OfflineSessionCountAggregateOutputType = {
    id: number
    userId: number
    disconnectedAt: number
    reconnectedAt: number
    earnedLoC: number
    earnedExp: number
    processed: number
    createdAt: number
    _all: number
  }


  export type OfflineSessionAvgAggregateInputType = {
    earnedLoC?: true
    earnedExp?: true
  }

  export type OfflineSessionSumAggregateInputType = {
    earnedLoC?: true
    earnedExp?: true
  }

  export type OfflineSessionMinAggregateInputType = {
    id?: true
    userId?: true
    disconnectedAt?: true
    reconnectedAt?: true
    earnedLoC?: true
    earnedExp?: true
    processed?: true
    createdAt?: true
  }

  export type OfflineSessionMaxAggregateInputType = {
    id?: true
    userId?: true
    disconnectedAt?: true
    reconnectedAt?: true
    earnedLoC?: true
    earnedExp?: true
    processed?: true
    createdAt?: true
  }

  export type OfflineSessionCountAggregateInputType = {
    id?: true
    userId?: true
    disconnectedAt?: true
    reconnectedAt?: true
    earnedLoC?: true
    earnedExp?: true
    processed?: true
    createdAt?: true
    _all?: true
  }

  export type OfflineSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OfflineSession to aggregate.
     */
    where?: OfflineSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OfflineSessions to fetch.
     */
    orderBy?: OfflineSessionOrderByWithRelationInput | OfflineSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OfflineSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OfflineSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OfflineSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OfflineSessions
    **/
    _count?: true | OfflineSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OfflineSessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OfflineSessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OfflineSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OfflineSessionMaxAggregateInputType
  }

  export type GetOfflineSessionAggregateType<T extends OfflineSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateOfflineSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOfflineSession[P]>
      : GetScalarType<T[P], AggregateOfflineSession[P]>
  }




  export type OfflineSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OfflineSessionWhereInput
    orderBy?: OfflineSessionOrderByWithAggregationInput | OfflineSessionOrderByWithAggregationInput[]
    by: OfflineSessionScalarFieldEnum[] | OfflineSessionScalarFieldEnum
    having?: OfflineSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OfflineSessionCountAggregateInputType | true
    _avg?: OfflineSessionAvgAggregateInputType
    _sum?: OfflineSessionSumAggregateInputType
    _min?: OfflineSessionMinAggregateInputType
    _max?: OfflineSessionMaxAggregateInputType
  }

  export type OfflineSessionGroupByOutputType = {
    id: string
    userId: string
    disconnectedAt: Date
    reconnectedAt: Date | null
    earnedLoC: Decimal | null
    earnedExp: Decimal | null
    processed: boolean
    createdAt: Date
    _count: OfflineSessionCountAggregateOutputType | null
    _avg: OfflineSessionAvgAggregateOutputType | null
    _sum: OfflineSessionSumAggregateOutputType | null
    _min: OfflineSessionMinAggregateOutputType | null
    _max: OfflineSessionMaxAggregateOutputType | null
  }

  type GetOfflineSessionGroupByPayload<T extends OfflineSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OfflineSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OfflineSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OfflineSessionGroupByOutputType[P]>
            : GetScalarType<T[P], OfflineSessionGroupByOutputType[P]>
        }
      >
    >


  export type OfflineSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    disconnectedAt?: boolean
    reconnectedAt?: boolean
    earnedLoC?: boolean
    earnedExp?: boolean
    processed?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["offlineSession"]>

  export type OfflineSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    disconnectedAt?: boolean
    reconnectedAt?: boolean
    earnedLoC?: boolean
    earnedExp?: boolean
    processed?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["offlineSession"]>

  export type OfflineSessionSelectScalar = {
    id?: boolean
    userId?: boolean
    disconnectedAt?: boolean
    reconnectedAt?: boolean
    earnedLoC?: boolean
    earnedExp?: boolean
    processed?: boolean
    createdAt?: boolean
  }


  export type $OfflineSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OfflineSession"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      disconnectedAt: Date
      reconnectedAt: Date | null
      earnedLoC: Prisma.Decimal | null
      earnedExp: Prisma.Decimal | null
      processed: boolean
      createdAt: Date
    }, ExtArgs["result"]["offlineSession"]>
    composites: {}
  }

  type OfflineSessionGetPayload<S extends boolean | null | undefined | OfflineSessionDefaultArgs> = $Result.GetResult<Prisma.$OfflineSessionPayload, S>

  type OfflineSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<OfflineSessionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: OfflineSessionCountAggregateInputType | true
    }

  export interface OfflineSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OfflineSession'], meta: { name: 'OfflineSession' } }
    /**
     * Find zero or one OfflineSession that matches the filter.
     * @param {OfflineSessionFindUniqueArgs} args - Arguments to find a OfflineSession
     * @example
     * // Get one OfflineSession
     * const offlineSession = await prisma.offlineSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OfflineSessionFindUniqueArgs>(args: SelectSubset<T, OfflineSessionFindUniqueArgs<ExtArgs>>): Prisma__OfflineSessionClient<$Result.GetResult<Prisma.$OfflineSessionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one OfflineSession that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {OfflineSessionFindUniqueOrThrowArgs} args - Arguments to find a OfflineSession
     * @example
     * // Get one OfflineSession
     * const offlineSession = await prisma.offlineSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OfflineSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, OfflineSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OfflineSessionClient<$Result.GetResult<Prisma.$OfflineSessionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first OfflineSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OfflineSessionFindFirstArgs} args - Arguments to find a OfflineSession
     * @example
     * // Get one OfflineSession
     * const offlineSession = await prisma.offlineSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OfflineSessionFindFirstArgs>(args?: SelectSubset<T, OfflineSessionFindFirstArgs<ExtArgs>>): Prisma__OfflineSessionClient<$Result.GetResult<Prisma.$OfflineSessionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first OfflineSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OfflineSessionFindFirstOrThrowArgs} args - Arguments to find a OfflineSession
     * @example
     * // Get one OfflineSession
     * const offlineSession = await prisma.offlineSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OfflineSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, OfflineSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__OfflineSessionClient<$Result.GetResult<Prisma.$OfflineSessionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more OfflineSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OfflineSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OfflineSessions
     * const offlineSessions = await prisma.offlineSession.findMany()
     * 
     * // Get first 10 OfflineSessions
     * const offlineSessions = await prisma.offlineSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const offlineSessionWithIdOnly = await prisma.offlineSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OfflineSessionFindManyArgs>(args?: SelectSubset<T, OfflineSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OfflineSessionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a OfflineSession.
     * @param {OfflineSessionCreateArgs} args - Arguments to create a OfflineSession.
     * @example
     * // Create one OfflineSession
     * const OfflineSession = await prisma.offlineSession.create({
     *   data: {
     *     // ... data to create a OfflineSession
     *   }
     * })
     * 
     */
    create<T extends OfflineSessionCreateArgs>(args: SelectSubset<T, OfflineSessionCreateArgs<ExtArgs>>): Prisma__OfflineSessionClient<$Result.GetResult<Prisma.$OfflineSessionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many OfflineSessions.
     * @param {OfflineSessionCreateManyArgs} args - Arguments to create many OfflineSessions.
     * @example
     * // Create many OfflineSessions
     * const offlineSession = await prisma.offlineSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OfflineSessionCreateManyArgs>(args?: SelectSubset<T, OfflineSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OfflineSessions and returns the data saved in the database.
     * @param {OfflineSessionCreateManyAndReturnArgs} args - Arguments to create many OfflineSessions.
     * @example
     * // Create many OfflineSessions
     * const offlineSession = await prisma.offlineSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OfflineSessions and only return the `id`
     * const offlineSessionWithIdOnly = await prisma.offlineSession.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OfflineSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, OfflineSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OfflineSessionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a OfflineSession.
     * @param {OfflineSessionDeleteArgs} args - Arguments to delete one OfflineSession.
     * @example
     * // Delete one OfflineSession
     * const OfflineSession = await prisma.offlineSession.delete({
     *   where: {
     *     // ... filter to delete one OfflineSession
     *   }
     * })
     * 
     */
    delete<T extends OfflineSessionDeleteArgs>(args: SelectSubset<T, OfflineSessionDeleteArgs<ExtArgs>>): Prisma__OfflineSessionClient<$Result.GetResult<Prisma.$OfflineSessionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one OfflineSession.
     * @param {OfflineSessionUpdateArgs} args - Arguments to update one OfflineSession.
     * @example
     * // Update one OfflineSession
     * const offlineSession = await prisma.offlineSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OfflineSessionUpdateArgs>(args: SelectSubset<T, OfflineSessionUpdateArgs<ExtArgs>>): Prisma__OfflineSessionClient<$Result.GetResult<Prisma.$OfflineSessionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more OfflineSessions.
     * @param {OfflineSessionDeleteManyArgs} args - Arguments to filter OfflineSessions to delete.
     * @example
     * // Delete a few OfflineSessions
     * const { count } = await prisma.offlineSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OfflineSessionDeleteManyArgs>(args?: SelectSubset<T, OfflineSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OfflineSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OfflineSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OfflineSessions
     * const offlineSession = await prisma.offlineSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OfflineSessionUpdateManyArgs>(args: SelectSubset<T, OfflineSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one OfflineSession.
     * @param {OfflineSessionUpsertArgs} args - Arguments to update or create a OfflineSession.
     * @example
     * // Update or create a OfflineSession
     * const offlineSession = await prisma.offlineSession.upsert({
     *   create: {
     *     // ... data to create a OfflineSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OfflineSession we want to update
     *   }
     * })
     */
    upsert<T extends OfflineSessionUpsertArgs>(args: SelectSubset<T, OfflineSessionUpsertArgs<ExtArgs>>): Prisma__OfflineSessionClient<$Result.GetResult<Prisma.$OfflineSessionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of OfflineSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OfflineSessionCountArgs} args - Arguments to filter OfflineSessions to count.
     * @example
     * // Count the number of OfflineSessions
     * const count = await prisma.offlineSession.count({
     *   where: {
     *     // ... the filter for the OfflineSessions we want to count
     *   }
     * })
    **/
    count<T extends OfflineSessionCountArgs>(
      args?: Subset<T, OfflineSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OfflineSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OfflineSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OfflineSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends OfflineSessionAggregateArgs>(args: Subset<T, OfflineSessionAggregateArgs>): Prisma.PrismaPromise<GetOfflineSessionAggregateType<T>>

    /**
     * Group by OfflineSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OfflineSessionGroupByArgs} args - Group by arguments.
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
      T extends OfflineSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OfflineSessionGroupByArgs['orderBy'] }
        : { orderBy?: OfflineSessionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, OfflineSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOfflineSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OfflineSession model
   */
  readonly fields: OfflineSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OfflineSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OfflineSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the OfflineSession model
   */ 
  interface OfflineSessionFieldRefs {
    readonly id: FieldRef<"OfflineSession", 'String'>
    readonly userId: FieldRef<"OfflineSession", 'String'>
    readonly disconnectedAt: FieldRef<"OfflineSession", 'DateTime'>
    readonly reconnectedAt: FieldRef<"OfflineSession", 'DateTime'>
    readonly earnedLoC: FieldRef<"OfflineSession", 'Decimal'>
    readonly earnedExp: FieldRef<"OfflineSession", 'Decimal'>
    readonly processed: FieldRef<"OfflineSession", 'Boolean'>
    readonly createdAt: FieldRef<"OfflineSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * OfflineSession findUnique
   */
  export type OfflineSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OfflineSession
     */
    select?: OfflineSessionSelect<ExtArgs> | null
    /**
     * Filter, which OfflineSession to fetch.
     */
    where: OfflineSessionWhereUniqueInput
  }

  /**
   * OfflineSession findUniqueOrThrow
   */
  export type OfflineSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OfflineSession
     */
    select?: OfflineSessionSelect<ExtArgs> | null
    /**
     * Filter, which OfflineSession to fetch.
     */
    where: OfflineSessionWhereUniqueInput
  }

  /**
   * OfflineSession findFirst
   */
  export type OfflineSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OfflineSession
     */
    select?: OfflineSessionSelect<ExtArgs> | null
    /**
     * Filter, which OfflineSession to fetch.
     */
    where?: OfflineSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OfflineSessions to fetch.
     */
    orderBy?: OfflineSessionOrderByWithRelationInput | OfflineSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OfflineSessions.
     */
    cursor?: OfflineSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OfflineSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OfflineSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OfflineSessions.
     */
    distinct?: OfflineSessionScalarFieldEnum | OfflineSessionScalarFieldEnum[]
  }

  /**
   * OfflineSession findFirstOrThrow
   */
  export type OfflineSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OfflineSession
     */
    select?: OfflineSessionSelect<ExtArgs> | null
    /**
     * Filter, which OfflineSession to fetch.
     */
    where?: OfflineSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OfflineSessions to fetch.
     */
    orderBy?: OfflineSessionOrderByWithRelationInput | OfflineSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OfflineSessions.
     */
    cursor?: OfflineSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OfflineSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OfflineSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OfflineSessions.
     */
    distinct?: OfflineSessionScalarFieldEnum | OfflineSessionScalarFieldEnum[]
  }

  /**
   * OfflineSession findMany
   */
  export type OfflineSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OfflineSession
     */
    select?: OfflineSessionSelect<ExtArgs> | null
    /**
     * Filter, which OfflineSessions to fetch.
     */
    where?: OfflineSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OfflineSessions to fetch.
     */
    orderBy?: OfflineSessionOrderByWithRelationInput | OfflineSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OfflineSessions.
     */
    cursor?: OfflineSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OfflineSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OfflineSessions.
     */
    skip?: number
    distinct?: OfflineSessionScalarFieldEnum | OfflineSessionScalarFieldEnum[]
  }

  /**
   * OfflineSession create
   */
  export type OfflineSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OfflineSession
     */
    select?: OfflineSessionSelect<ExtArgs> | null
    /**
     * The data needed to create a OfflineSession.
     */
    data: XOR<OfflineSessionCreateInput, OfflineSessionUncheckedCreateInput>
  }

  /**
   * OfflineSession createMany
   */
  export type OfflineSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OfflineSessions.
     */
    data: OfflineSessionCreateManyInput | OfflineSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OfflineSession createManyAndReturn
   */
  export type OfflineSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OfflineSession
     */
    select?: OfflineSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many OfflineSessions.
     */
    data: OfflineSessionCreateManyInput | OfflineSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OfflineSession update
   */
  export type OfflineSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OfflineSession
     */
    select?: OfflineSessionSelect<ExtArgs> | null
    /**
     * The data needed to update a OfflineSession.
     */
    data: XOR<OfflineSessionUpdateInput, OfflineSessionUncheckedUpdateInput>
    /**
     * Choose, which OfflineSession to update.
     */
    where: OfflineSessionWhereUniqueInput
  }

  /**
   * OfflineSession updateMany
   */
  export type OfflineSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OfflineSessions.
     */
    data: XOR<OfflineSessionUpdateManyMutationInput, OfflineSessionUncheckedUpdateManyInput>
    /**
     * Filter which OfflineSessions to update
     */
    where?: OfflineSessionWhereInput
  }

  /**
   * OfflineSession upsert
   */
  export type OfflineSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OfflineSession
     */
    select?: OfflineSessionSelect<ExtArgs> | null
    /**
     * The filter to search for the OfflineSession to update in case it exists.
     */
    where: OfflineSessionWhereUniqueInput
    /**
     * In case the OfflineSession found by the `where` argument doesn't exist, create a new OfflineSession with this data.
     */
    create: XOR<OfflineSessionCreateInput, OfflineSessionUncheckedCreateInput>
    /**
     * In case the OfflineSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OfflineSessionUpdateInput, OfflineSessionUncheckedUpdateInput>
  }

  /**
   * OfflineSession delete
   */
  export type OfflineSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OfflineSession
     */
    select?: OfflineSessionSelect<ExtArgs> | null
    /**
     * Filter which OfflineSession to delete.
     */
    where: OfflineSessionWhereUniqueInput
  }

  /**
   * OfflineSession deleteMany
   */
  export type OfflineSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OfflineSessions to delete
     */
    where?: OfflineSessionWhereInput
  }

  /**
   * OfflineSession without action
   */
  export type OfflineSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OfflineSession
     */
    select?: OfflineSessionSelect<ExtArgs> | null
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


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    username: 'username',
    password: 'password',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    lastLoginAt: 'lastLoginAt',
    lastActiveAt: 'lastActiveAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const ProgressionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    linesOfCode: 'linesOfCode',
    totalLinesWritten: 'totalLinesWritten',
    clickMultiplier: 'clickMultiplier',
    passiveMultiplier: 'passiveMultiplier',
    criticalChance: 'criticalChance',
    criticalMultiplier: 'criticalMultiplier',
    level: 'level',
    experience: 'experience',
    experienceToNext: 'experienceToNext',
    prestigeLevel: 'prestigeLevel',
    prestigePoints: 'prestigePoints',
    totalClicks: 'totalClicks',
    totalPlaytimeSeconds: 'totalPlaytimeSeconds',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProgressionScalarFieldEnum = (typeof ProgressionScalarFieldEnum)[keyof typeof ProgressionScalarFieldEnum]


  export const ItemScalarFieldEnum: {
    id: 'id',
    slug: 'slug',
    name: 'name',
    description: 'description',
    category: 'category',
    baseCost: 'baseCost',
    baseEffect: 'baseEffect',
    effectType: 'effectType',
    costMultiplier: 'costMultiplier',
    maxQuantity: 'maxQuantity',
    unlockLevel: 'unlockLevel',
    unlockItemSlug: 'unlockItemSlug',
    iconUrl: 'iconUrl',
    rarity: 'rarity',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ItemScalarFieldEnum = (typeof ItemScalarFieldEnum)[keyof typeof ItemScalarFieldEnum]


  export const OwnedItemScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    itemId: 'itemId',
    quantity: 'quantity',
    level: 'level',
    purchasedAt: 'purchasedAt',
    updatedAt: 'updatedAt'
  };

  export type OwnedItemScalarFieldEnum = (typeof OwnedItemScalarFieldEnum)[keyof typeof OwnedItemScalarFieldEnum]


  export const ProgramTypeScalarFieldEnum: {
    id: 'id',
    slug: 'slug',
    name: 'name',
    description: 'description',
    baseDurationSecs: 'baseDurationSecs',
    baseReward: 'baseReward',
    experienceReward: 'experienceReward',
    rewardMultiplier: 'rewardMultiplier',
    unlockLevel: 'unlockLevel',
    lootTable: 'lootTable',
    iconUrl: 'iconUrl',
    category: 'category',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProgramTypeScalarFieldEnum = (typeof ProgramTypeScalarFieldEnum)[keyof typeof ProgramTypeScalarFieldEnum]


  export const ActiveProgramScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    programTypeId: 'programTypeId',
    startedAt: 'startedAt',
    estimatedEndAt: 'estimatedEndAt',
    completedAt: 'completedAt',
    status: 'status',
    bullJobId: 'bullJobId',
    earnedReward: 'earnedReward',
    earnedExp: 'earnedExp',
    lootItems: 'lootItems',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ActiveProgramScalarFieldEnum = (typeof ActiveProgramScalarFieldEnum)[keyof typeof ActiveProgramScalarFieldEnum]


  export const TransactionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    stripePaymentId: 'stripePaymentId',
    stripeCustomerId: 'stripeCustomerId',
    amountCents: 'amountCents',
    currency: 'currency',
    status: 'status',
    processedAt: 'processedAt',
    idempotencyKey: 'idempotencyKey',
    productType: 'productType',
    productData: 'productData',
    fulfilled: 'fulfilled',
    fulfilledAt: 'fulfilledAt',
    fulfillmentJobId: 'fulfillmentJobId',
    lastError: 'lastError',
    retryCount: 'retryCount',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TransactionScalarFieldEnum = (typeof TransactionScalarFieldEnum)[keyof typeof TransactionScalarFieldEnum]


  export const AchievementScalarFieldEnum: {
    id: 'id',
    slug: 'slug',
    name: 'name',
    description: 'description',
    conditionType: 'conditionType',
    conditionValue: 'conditionValue',
    rewardLoC: 'rewardLoC',
    rewardExp: 'rewardExp',
    rewardItemSlug: 'rewardItemSlug',
    iconUrl: 'iconUrl',
    points: 'points',
    hidden: 'hidden',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AchievementScalarFieldEnum = (typeof AchievementScalarFieldEnum)[keyof typeof AchievementScalarFieldEnum]


  export const UserAchievementScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    achievementId: 'achievementId',
    unlockedAt: 'unlockedAt',
    claimed: 'claimed',
    claimedAt: 'claimedAt'
  };

  export type UserAchievementScalarFieldEnum = (typeof UserAchievementScalarFieldEnum)[keyof typeof UserAchievementScalarFieldEnum]


  export const OfflineSessionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    disconnectedAt: 'disconnectedAt',
    reconnectedAt: 'reconnectedAt',
    earnedLoC: 'earnedLoC',
    earnedExp: 'earnedExp',
    processed: 'processed',
    createdAt: 'createdAt'
  };

  export type OfflineSessionScalarFieldEnum = (typeof OfflineSessionScalarFieldEnum)[keyof typeof OfflineSessionScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


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
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>
    


  /**
   * Reference to a field of type 'ItemCategory'
   */
  export type EnumItemCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ItemCategory'>
    


  /**
   * Reference to a field of type 'ItemCategory[]'
   */
  export type ListEnumItemCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ItemCategory[]'>
    


  /**
   * Reference to a field of type 'EffectType'
   */
  export type EnumEffectTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EffectType'>
    


  /**
   * Reference to a field of type 'EffectType[]'
   */
  export type ListEnumEffectTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EffectType[]'>
    


  /**
   * Reference to a field of type 'Rarity'
   */
  export type EnumRarityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Rarity'>
    


  /**
   * Reference to a field of type 'Rarity[]'
   */
  export type ListEnumRarityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Rarity[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'ProgramCategory'
   */
  export type EnumProgramCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProgramCategory'>
    


  /**
   * Reference to a field of type 'ProgramCategory[]'
   */
  export type ListEnumProgramCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProgramCategory[]'>
    


  /**
   * Reference to a field of type 'ProgramStatus'
   */
  export type EnumProgramStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProgramStatus'>
    


  /**
   * Reference to a field of type 'ProgramStatus[]'
   */
  export type ListEnumProgramStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProgramStatus[]'>
    


  /**
   * Reference to a field of type 'TransactionStatus'
   */
  export type EnumTransactionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TransactionStatus'>
    


  /**
   * Reference to a field of type 'TransactionStatus[]'
   */
  export type ListEnumTransactionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TransactionStatus[]'>
    


  /**
   * Reference to a field of type 'ProductType'
   */
  export type EnumProductTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProductType'>
    


  /**
   * Reference to a field of type 'ProductType[]'
   */
  export type ListEnumProductTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProductType[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'AchievementCondition'
   */
  export type EnumAchievementConditionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AchievementCondition'>
    


  /**
   * Reference to a field of type 'AchievementCondition[]'
   */
  export type ListEnumAchievementConditionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AchievementCondition[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    username?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    lastLoginAt?: DateTimeNullableFilter<"User"> | Date | string | null
    lastActiveAt?: DateTimeNullableFilter<"User"> | Date | string | null
    progression?: XOR<ProgressionNullableRelationFilter, ProgressionWhereInput> | null
    ownedItems?: OwnedItemListRelationFilter
    activePrograms?: ActiveProgramListRelationFilter
    transactions?: TransactionListRelationFilter
    achievements?: UserAchievementListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    lastActiveAt?: SortOrderInput | SortOrder
    progression?: ProgressionOrderByWithRelationInput
    ownedItems?: OwnedItemOrderByRelationAggregateInput
    activePrograms?: ActiveProgramOrderByRelationAggregateInput
    transactions?: TransactionOrderByRelationAggregateInput
    achievements?: UserAchievementOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    username?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    lastLoginAt?: DateTimeNullableFilter<"User"> | Date | string | null
    lastActiveAt?: DateTimeNullableFilter<"User"> | Date | string | null
    progression?: XOR<ProgressionNullableRelationFilter, ProgressionWhereInput> | null
    ownedItems?: OwnedItemListRelationFilter
    activePrograms?: ActiveProgramListRelationFilter
    transactions?: TransactionListRelationFilter
    achievements?: UserAchievementListRelationFilter
  }, "id" | "email" | "username">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    lastActiveAt?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    username?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    lastLoginAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    lastActiveAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
  }

  export type ProgressionWhereInput = {
    AND?: ProgressionWhereInput | ProgressionWhereInput[]
    OR?: ProgressionWhereInput[]
    NOT?: ProgressionWhereInput | ProgressionWhereInput[]
    id?: StringFilter<"Progression"> | string
    userId?: StringFilter<"Progression"> | string
    linesOfCode?: DecimalFilter<"Progression"> | Decimal | DecimalJsLike | number | string
    totalLinesWritten?: DecimalFilter<"Progression"> | Decimal | DecimalJsLike | number | string
    clickMultiplier?: FloatFilter<"Progression"> | number
    passiveMultiplier?: FloatFilter<"Progression"> | number
    criticalChance?: FloatFilter<"Progression"> | number
    criticalMultiplier?: FloatFilter<"Progression"> | number
    level?: IntFilter<"Progression"> | number
    experience?: DecimalFilter<"Progression"> | Decimal | DecimalJsLike | number | string
    experienceToNext?: DecimalFilter<"Progression"> | Decimal | DecimalJsLike | number | string
    prestigeLevel?: IntFilter<"Progression"> | number
    prestigePoints?: DecimalFilter<"Progression"> | Decimal | DecimalJsLike | number | string
    totalClicks?: BigIntFilter<"Progression"> | bigint | number
    totalPlaytimeSeconds?: BigIntFilter<"Progression"> | bigint | number
    createdAt?: DateTimeFilter<"Progression"> | Date | string
    updatedAt?: DateTimeFilter<"Progression"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type ProgressionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    linesOfCode?: SortOrder
    totalLinesWritten?: SortOrder
    clickMultiplier?: SortOrder
    passiveMultiplier?: SortOrder
    criticalChance?: SortOrder
    criticalMultiplier?: SortOrder
    level?: SortOrder
    experience?: SortOrder
    experienceToNext?: SortOrder
    prestigeLevel?: SortOrder
    prestigePoints?: SortOrder
    totalClicks?: SortOrder
    totalPlaytimeSeconds?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type ProgressionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: ProgressionWhereInput | ProgressionWhereInput[]
    OR?: ProgressionWhereInput[]
    NOT?: ProgressionWhereInput | ProgressionWhereInput[]
    linesOfCode?: DecimalFilter<"Progression"> | Decimal | DecimalJsLike | number | string
    totalLinesWritten?: DecimalFilter<"Progression"> | Decimal | DecimalJsLike | number | string
    clickMultiplier?: FloatFilter<"Progression"> | number
    passiveMultiplier?: FloatFilter<"Progression"> | number
    criticalChance?: FloatFilter<"Progression"> | number
    criticalMultiplier?: FloatFilter<"Progression"> | number
    level?: IntFilter<"Progression"> | number
    experience?: DecimalFilter<"Progression"> | Decimal | DecimalJsLike | number | string
    experienceToNext?: DecimalFilter<"Progression"> | Decimal | DecimalJsLike | number | string
    prestigeLevel?: IntFilter<"Progression"> | number
    prestigePoints?: DecimalFilter<"Progression"> | Decimal | DecimalJsLike | number | string
    totalClicks?: BigIntFilter<"Progression"> | bigint | number
    totalPlaytimeSeconds?: BigIntFilter<"Progression"> | bigint | number
    createdAt?: DateTimeFilter<"Progression"> | Date | string
    updatedAt?: DateTimeFilter<"Progression"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id" | "userId">

  export type ProgressionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    linesOfCode?: SortOrder
    totalLinesWritten?: SortOrder
    clickMultiplier?: SortOrder
    passiveMultiplier?: SortOrder
    criticalChance?: SortOrder
    criticalMultiplier?: SortOrder
    level?: SortOrder
    experience?: SortOrder
    experienceToNext?: SortOrder
    prestigeLevel?: SortOrder
    prestigePoints?: SortOrder
    totalClicks?: SortOrder
    totalPlaytimeSeconds?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProgressionCountOrderByAggregateInput
    _avg?: ProgressionAvgOrderByAggregateInput
    _max?: ProgressionMaxOrderByAggregateInput
    _min?: ProgressionMinOrderByAggregateInput
    _sum?: ProgressionSumOrderByAggregateInput
  }

  export type ProgressionScalarWhereWithAggregatesInput = {
    AND?: ProgressionScalarWhereWithAggregatesInput | ProgressionScalarWhereWithAggregatesInput[]
    OR?: ProgressionScalarWhereWithAggregatesInput[]
    NOT?: ProgressionScalarWhereWithAggregatesInput | ProgressionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Progression"> | string
    userId?: StringWithAggregatesFilter<"Progression"> | string
    linesOfCode?: DecimalWithAggregatesFilter<"Progression"> | Decimal | DecimalJsLike | number | string
    totalLinesWritten?: DecimalWithAggregatesFilter<"Progression"> | Decimal | DecimalJsLike | number | string
    clickMultiplier?: FloatWithAggregatesFilter<"Progression"> | number
    passiveMultiplier?: FloatWithAggregatesFilter<"Progression"> | number
    criticalChance?: FloatWithAggregatesFilter<"Progression"> | number
    criticalMultiplier?: FloatWithAggregatesFilter<"Progression"> | number
    level?: IntWithAggregatesFilter<"Progression"> | number
    experience?: DecimalWithAggregatesFilter<"Progression"> | Decimal | DecimalJsLike | number | string
    experienceToNext?: DecimalWithAggregatesFilter<"Progression"> | Decimal | DecimalJsLike | number | string
    prestigeLevel?: IntWithAggregatesFilter<"Progression"> | number
    prestigePoints?: DecimalWithAggregatesFilter<"Progression"> | Decimal | DecimalJsLike | number | string
    totalClicks?: BigIntWithAggregatesFilter<"Progression"> | bigint | number
    totalPlaytimeSeconds?: BigIntWithAggregatesFilter<"Progression"> | bigint | number
    createdAt?: DateTimeWithAggregatesFilter<"Progression"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Progression"> | Date | string
  }

  export type ItemWhereInput = {
    AND?: ItemWhereInput | ItemWhereInput[]
    OR?: ItemWhereInput[]
    NOT?: ItemWhereInput | ItemWhereInput[]
    id?: StringFilter<"Item"> | string
    slug?: StringFilter<"Item"> | string
    name?: StringFilter<"Item"> | string
    description?: StringFilter<"Item"> | string
    category?: EnumItemCategoryFilter<"Item"> | $Enums.ItemCategory
    baseCost?: DecimalFilter<"Item"> | Decimal | DecimalJsLike | number | string
    baseEffect?: FloatFilter<"Item"> | number
    effectType?: EnumEffectTypeFilter<"Item"> | $Enums.EffectType
    costMultiplier?: FloatFilter<"Item"> | number
    maxQuantity?: IntNullableFilter<"Item"> | number | null
    unlockLevel?: IntFilter<"Item"> | number
    unlockItemSlug?: StringNullableFilter<"Item"> | string | null
    iconUrl?: StringNullableFilter<"Item"> | string | null
    rarity?: EnumRarityFilter<"Item"> | $Enums.Rarity
    createdAt?: DateTimeFilter<"Item"> | Date | string
    updatedAt?: DateTimeFilter<"Item"> | Date | string
    ownedItems?: OwnedItemListRelationFilter
  }

  export type ItemOrderByWithRelationInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    baseCost?: SortOrder
    baseEffect?: SortOrder
    effectType?: SortOrder
    costMultiplier?: SortOrder
    maxQuantity?: SortOrderInput | SortOrder
    unlockLevel?: SortOrder
    unlockItemSlug?: SortOrderInput | SortOrder
    iconUrl?: SortOrderInput | SortOrder
    rarity?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ownedItems?: OwnedItemOrderByRelationAggregateInput
  }

  export type ItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: ItemWhereInput | ItemWhereInput[]
    OR?: ItemWhereInput[]
    NOT?: ItemWhereInput | ItemWhereInput[]
    name?: StringFilter<"Item"> | string
    description?: StringFilter<"Item"> | string
    category?: EnumItemCategoryFilter<"Item"> | $Enums.ItemCategory
    baseCost?: DecimalFilter<"Item"> | Decimal | DecimalJsLike | number | string
    baseEffect?: FloatFilter<"Item"> | number
    effectType?: EnumEffectTypeFilter<"Item"> | $Enums.EffectType
    costMultiplier?: FloatFilter<"Item"> | number
    maxQuantity?: IntNullableFilter<"Item"> | number | null
    unlockLevel?: IntFilter<"Item"> | number
    unlockItemSlug?: StringNullableFilter<"Item"> | string | null
    iconUrl?: StringNullableFilter<"Item"> | string | null
    rarity?: EnumRarityFilter<"Item"> | $Enums.Rarity
    createdAt?: DateTimeFilter<"Item"> | Date | string
    updatedAt?: DateTimeFilter<"Item"> | Date | string
    ownedItems?: OwnedItemListRelationFilter
  }, "id" | "slug">

  export type ItemOrderByWithAggregationInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    baseCost?: SortOrder
    baseEffect?: SortOrder
    effectType?: SortOrder
    costMultiplier?: SortOrder
    maxQuantity?: SortOrderInput | SortOrder
    unlockLevel?: SortOrder
    unlockItemSlug?: SortOrderInput | SortOrder
    iconUrl?: SortOrderInput | SortOrder
    rarity?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ItemCountOrderByAggregateInput
    _avg?: ItemAvgOrderByAggregateInput
    _max?: ItemMaxOrderByAggregateInput
    _min?: ItemMinOrderByAggregateInput
    _sum?: ItemSumOrderByAggregateInput
  }

  export type ItemScalarWhereWithAggregatesInput = {
    AND?: ItemScalarWhereWithAggregatesInput | ItemScalarWhereWithAggregatesInput[]
    OR?: ItemScalarWhereWithAggregatesInput[]
    NOT?: ItemScalarWhereWithAggregatesInput | ItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Item"> | string
    slug?: StringWithAggregatesFilter<"Item"> | string
    name?: StringWithAggregatesFilter<"Item"> | string
    description?: StringWithAggregatesFilter<"Item"> | string
    category?: EnumItemCategoryWithAggregatesFilter<"Item"> | $Enums.ItemCategory
    baseCost?: DecimalWithAggregatesFilter<"Item"> | Decimal | DecimalJsLike | number | string
    baseEffect?: FloatWithAggregatesFilter<"Item"> | number
    effectType?: EnumEffectTypeWithAggregatesFilter<"Item"> | $Enums.EffectType
    costMultiplier?: FloatWithAggregatesFilter<"Item"> | number
    maxQuantity?: IntNullableWithAggregatesFilter<"Item"> | number | null
    unlockLevel?: IntWithAggregatesFilter<"Item"> | number
    unlockItemSlug?: StringNullableWithAggregatesFilter<"Item"> | string | null
    iconUrl?: StringNullableWithAggregatesFilter<"Item"> | string | null
    rarity?: EnumRarityWithAggregatesFilter<"Item"> | $Enums.Rarity
    createdAt?: DateTimeWithAggregatesFilter<"Item"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Item"> | Date | string
  }

  export type OwnedItemWhereInput = {
    AND?: OwnedItemWhereInput | OwnedItemWhereInput[]
    OR?: OwnedItemWhereInput[]
    NOT?: OwnedItemWhereInput | OwnedItemWhereInput[]
    id?: StringFilter<"OwnedItem"> | string
    userId?: StringFilter<"OwnedItem"> | string
    itemId?: StringFilter<"OwnedItem"> | string
    quantity?: IntFilter<"OwnedItem"> | number
    level?: IntFilter<"OwnedItem"> | number
    purchasedAt?: DateTimeFilter<"OwnedItem"> | Date | string
    updatedAt?: DateTimeFilter<"OwnedItem"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    item?: XOR<ItemRelationFilter, ItemWhereInput>
  }

  export type OwnedItemOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    itemId?: SortOrder
    quantity?: SortOrder
    level?: SortOrder
    purchasedAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    item?: ItemOrderByWithRelationInput
  }

  export type OwnedItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_itemId?: OwnedItemUserIdItemIdCompoundUniqueInput
    AND?: OwnedItemWhereInput | OwnedItemWhereInput[]
    OR?: OwnedItemWhereInput[]
    NOT?: OwnedItemWhereInput | OwnedItemWhereInput[]
    userId?: StringFilter<"OwnedItem"> | string
    itemId?: StringFilter<"OwnedItem"> | string
    quantity?: IntFilter<"OwnedItem"> | number
    level?: IntFilter<"OwnedItem"> | number
    purchasedAt?: DateTimeFilter<"OwnedItem"> | Date | string
    updatedAt?: DateTimeFilter<"OwnedItem"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    item?: XOR<ItemRelationFilter, ItemWhereInput>
  }, "id" | "userId_itemId">

  export type OwnedItemOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    itemId?: SortOrder
    quantity?: SortOrder
    level?: SortOrder
    purchasedAt?: SortOrder
    updatedAt?: SortOrder
    _count?: OwnedItemCountOrderByAggregateInput
    _avg?: OwnedItemAvgOrderByAggregateInput
    _max?: OwnedItemMaxOrderByAggregateInput
    _min?: OwnedItemMinOrderByAggregateInput
    _sum?: OwnedItemSumOrderByAggregateInput
  }

  export type OwnedItemScalarWhereWithAggregatesInput = {
    AND?: OwnedItemScalarWhereWithAggregatesInput | OwnedItemScalarWhereWithAggregatesInput[]
    OR?: OwnedItemScalarWhereWithAggregatesInput[]
    NOT?: OwnedItemScalarWhereWithAggregatesInput | OwnedItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"OwnedItem"> | string
    userId?: StringWithAggregatesFilter<"OwnedItem"> | string
    itemId?: StringWithAggregatesFilter<"OwnedItem"> | string
    quantity?: IntWithAggregatesFilter<"OwnedItem"> | number
    level?: IntWithAggregatesFilter<"OwnedItem"> | number
    purchasedAt?: DateTimeWithAggregatesFilter<"OwnedItem"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"OwnedItem"> | Date | string
  }

  export type ProgramTypeWhereInput = {
    AND?: ProgramTypeWhereInput | ProgramTypeWhereInput[]
    OR?: ProgramTypeWhereInput[]
    NOT?: ProgramTypeWhereInput | ProgramTypeWhereInput[]
    id?: StringFilter<"ProgramType"> | string
    slug?: StringFilter<"ProgramType"> | string
    name?: StringFilter<"ProgramType"> | string
    description?: StringFilter<"ProgramType"> | string
    baseDurationSecs?: IntFilter<"ProgramType"> | number
    baseReward?: DecimalFilter<"ProgramType"> | Decimal | DecimalJsLike | number | string
    experienceReward?: DecimalFilter<"ProgramType"> | Decimal | DecimalJsLike | number | string
    rewardMultiplier?: FloatFilter<"ProgramType"> | number
    unlockLevel?: IntFilter<"ProgramType"> | number
    lootTable?: JsonNullableFilter<"ProgramType">
    iconUrl?: StringNullableFilter<"ProgramType"> | string | null
    category?: EnumProgramCategoryFilter<"ProgramType"> | $Enums.ProgramCategory
    createdAt?: DateTimeFilter<"ProgramType"> | Date | string
    updatedAt?: DateTimeFilter<"ProgramType"> | Date | string
    activePrograms?: ActiveProgramListRelationFilter
  }

  export type ProgramTypeOrderByWithRelationInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    description?: SortOrder
    baseDurationSecs?: SortOrder
    baseReward?: SortOrder
    experienceReward?: SortOrder
    rewardMultiplier?: SortOrder
    unlockLevel?: SortOrder
    lootTable?: SortOrderInput | SortOrder
    iconUrl?: SortOrderInput | SortOrder
    category?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    activePrograms?: ActiveProgramOrderByRelationAggregateInput
  }

  export type ProgramTypeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: ProgramTypeWhereInput | ProgramTypeWhereInput[]
    OR?: ProgramTypeWhereInput[]
    NOT?: ProgramTypeWhereInput | ProgramTypeWhereInput[]
    name?: StringFilter<"ProgramType"> | string
    description?: StringFilter<"ProgramType"> | string
    baseDurationSecs?: IntFilter<"ProgramType"> | number
    baseReward?: DecimalFilter<"ProgramType"> | Decimal | DecimalJsLike | number | string
    experienceReward?: DecimalFilter<"ProgramType"> | Decimal | DecimalJsLike | number | string
    rewardMultiplier?: FloatFilter<"ProgramType"> | number
    unlockLevel?: IntFilter<"ProgramType"> | number
    lootTable?: JsonNullableFilter<"ProgramType">
    iconUrl?: StringNullableFilter<"ProgramType"> | string | null
    category?: EnumProgramCategoryFilter<"ProgramType"> | $Enums.ProgramCategory
    createdAt?: DateTimeFilter<"ProgramType"> | Date | string
    updatedAt?: DateTimeFilter<"ProgramType"> | Date | string
    activePrograms?: ActiveProgramListRelationFilter
  }, "id" | "slug">

  export type ProgramTypeOrderByWithAggregationInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    description?: SortOrder
    baseDurationSecs?: SortOrder
    baseReward?: SortOrder
    experienceReward?: SortOrder
    rewardMultiplier?: SortOrder
    unlockLevel?: SortOrder
    lootTable?: SortOrderInput | SortOrder
    iconUrl?: SortOrderInput | SortOrder
    category?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProgramTypeCountOrderByAggregateInput
    _avg?: ProgramTypeAvgOrderByAggregateInput
    _max?: ProgramTypeMaxOrderByAggregateInput
    _min?: ProgramTypeMinOrderByAggregateInput
    _sum?: ProgramTypeSumOrderByAggregateInput
  }

  export type ProgramTypeScalarWhereWithAggregatesInput = {
    AND?: ProgramTypeScalarWhereWithAggregatesInput | ProgramTypeScalarWhereWithAggregatesInput[]
    OR?: ProgramTypeScalarWhereWithAggregatesInput[]
    NOT?: ProgramTypeScalarWhereWithAggregatesInput | ProgramTypeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProgramType"> | string
    slug?: StringWithAggregatesFilter<"ProgramType"> | string
    name?: StringWithAggregatesFilter<"ProgramType"> | string
    description?: StringWithAggregatesFilter<"ProgramType"> | string
    baseDurationSecs?: IntWithAggregatesFilter<"ProgramType"> | number
    baseReward?: DecimalWithAggregatesFilter<"ProgramType"> | Decimal | DecimalJsLike | number | string
    experienceReward?: DecimalWithAggregatesFilter<"ProgramType"> | Decimal | DecimalJsLike | number | string
    rewardMultiplier?: FloatWithAggregatesFilter<"ProgramType"> | number
    unlockLevel?: IntWithAggregatesFilter<"ProgramType"> | number
    lootTable?: JsonNullableWithAggregatesFilter<"ProgramType">
    iconUrl?: StringNullableWithAggregatesFilter<"ProgramType"> | string | null
    category?: EnumProgramCategoryWithAggregatesFilter<"ProgramType"> | $Enums.ProgramCategory
    createdAt?: DateTimeWithAggregatesFilter<"ProgramType"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ProgramType"> | Date | string
  }

  export type ActiveProgramWhereInput = {
    AND?: ActiveProgramWhereInput | ActiveProgramWhereInput[]
    OR?: ActiveProgramWhereInput[]
    NOT?: ActiveProgramWhereInput | ActiveProgramWhereInput[]
    id?: StringFilter<"ActiveProgram"> | string
    userId?: StringFilter<"ActiveProgram"> | string
    programTypeId?: StringFilter<"ActiveProgram"> | string
    startedAt?: DateTimeFilter<"ActiveProgram"> | Date | string
    estimatedEndAt?: DateTimeFilter<"ActiveProgram"> | Date | string
    completedAt?: DateTimeNullableFilter<"ActiveProgram"> | Date | string | null
    status?: EnumProgramStatusFilter<"ActiveProgram"> | $Enums.ProgramStatus
    bullJobId?: StringNullableFilter<"ActiveProgram"> | string | null
    earnedReward?: DecimalNullableFilter<"ActiveProgram"> | Decimal | DecimalJsLike | number | string | null
    earnedExp?: DecimalNullableFilter<"ActiveProgram"> | Decimal | DecimalJsLike | number | string | null
    lootItems?: JsonNullableFilter<"ActiveProgram">
    createdAt?: DateTimeFilter<"ActiveProgram"> | Date | string
    updatedAt?: DateTimeFilter<"ActiveProgram"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    programType?: XOR<ProgramTypeRelationFilter, ProgramTypeWhereInput>
  }

  export type ActiveProgramOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    programTypeId?: SortOrder
    startedAt?: SortOrder
    estimatedEndAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    status?: SortOrder
    bullJobId?: SortOrderInput | SortOrder
    earnedReward?: SortOrderInput | SortOrder
    earnedExp?: SortOrderInput | SortOrder
    lootItems?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    programType?: ProgramTypeOrderByWithRelationInput
  }

  export type ActiveProgramWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ActiveProgramWhereInput | ActiveProgramWhereInput[]
    OR?: ActiveProgramWhereInput[]
    NOT?: ActiveProgramWhereInput | ActiveProgramWhereInput[]
    userId?: StringFilter<"ActiveProgram"> | string
    programTypeId?: StringFilter<"ActiveProgram"> | string
    startedAt?: DateTimeFilter<"ActiveProgram"> | Date | string
    estimatedEndAt?: DateTimeFilter<"ActiveProgram"> | Date | string
    completedAt?: DateTimeNullableFilter<"ActiveProgram"> | Date | string | null
    status?: EnumProgramStatusFilter<"ActiveProgram"> | $Enums.ProgramStatus
    bullJobId?: StringNullableFilter<"ActiveProgram"> | string | null
    earnedReward?: DecimalNullableFilter<"ActiveProgram"> | Decimal | DecimalJsLike | number | string | null
    earnedExp?: DecimalNullableFilter<"ActiveProgram"> | Decimal | DecimalJsLike | number | string | null
    lootItems?: JsonNullableFilter<"ActiveProgram">
    createdAt?: DateTimeFilter<"ActiveProgram"> | Date | string
    updatedAt?: DateTimeFilter<"ActiveProgram"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    programType?: XOR<ProgramTypeRelationFilter, ProgramTypeWhereInput>
  }, "id">

  export type ActiveProgramOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    programTypeId?: SortOrder
    startedAt?: SortOrder
    estimatedEndAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    status?: SortOrder
    bullJobId?: SortOrderInput | SortOrder
    earnedReward?: SortOrderInput | SortOrder
    earnedExp?: SortOrderInput | SortOrder
    lootItems?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ActiveProgramCountOrderByAggregateInput
    _avg?: ActiveProgramAvgOrderByAggregateInput
    _max?: ActiveProgramMaxOrderByAggregateInput
    _min?: ActiveProgramMinOrderByAggregateInput
    _sum?: ActiveProgramSumOrderByAggregateInput
  }

  export type ActiveProgramScalarWhereWithAggregatesInput = {
    AND?: ActiveProgramScalarWhereWithAggregatesInput | ActiveProgramScalarWhereWithAggregatesInput[]
    OR?: ActiveProgramScalarWhereWithAggregatesInput[]
    NOT?: ActiveProgramScalarWhereWithAggregatesInput | ActiveProgramScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ActiveProgram"> | string
    userId?: StringWithAggregatesFilter<"ActiveProgram"> | string
    programTypeId?: StringWithAggregatesFilter<"ActiveProgram"> | string
    startedAt?: DateTimeWithAggregatesFilter<"ActiveProgram"> | Date | string
    estimatedEndAt?: DateTimeWithAggregatesFilter<"ActiveProgram"> | Date | string
    completedAt?: DateTimeNullableWithAggregatesFilter<"ActiveProgram"> | Date | string | null
    status?: EnumProgramStatusWithAggregatesFilter<"ActiveProgram"> | $Enums.ProgramStatus
    bullJobId?: StringNullableWithAggregatesFilter<"ActiveProgram"> | string | null
    earnedReward?: DecimalNullableWithAggregatesFilter<"ActiveProgram"> | Decimal | DecimalJsLike | number | string | null
    earnedExp?: DecimalNullableWithAggregatesFilter<"ActiveProgram"> | Decimal | DecimalJsLike | number | string | null
    lootItems?: JsonNullableWithAggregatesFilter<"ActiveProgram">
    createdAt?: DateTimeWithAggregatesFilter<"ActiveProgram"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ActiveProgram"> | Date | string
  }

  export type TransactionWhereInput = {
    AND?: TransactionWhereInput | TransactionWhereInput[]
    OR?: TransactionWhereInput[]
    NOT?: TransactionWhereInput | TransactionWhereInput[]
    id?: StringFilter<"Transaction"> | string
    userId?: StringFilter<"Transaction"> | string
    stripePaymentId?: StringFilter<"Transaction"> | string
    stripeCustomerId?: StringNullableFilter<"Transaction"> | string | null
    amountCents?: IntFilter<"Transaction"> | number
    currency?: StringFilter<"Transaction"> | string
    status?: EnumTransactionStatusFilter<"Transaction"> | $Enums.TransactionStatus
    processedAt?: DateTimeNullableFilter<"Transaction"> | Date | string | null
    idempotencyKey?: StringFilter<"Transaction"> | string
    productType?: EnumProductTypeFilter<"Transaction"> | $Enums.ProductType
    productData?: JsonFilter<"Transaction">
    fulfilled?: BoolFilter<"Transaction"> | boolean
    fulfilledAt?: DateTimeNullableFilter<"Transaction"> | Date | string | null
    fulfillmentJobId?: StringNullableFilter<"Transaction"> | string | null
    lastError?: StringNullableFilter<"Transaction"> | string | null
    retryCount?: IntFilter<"Transaction"> | number
    createdAt?: DateTimeFilter<"Transaction"> | Date | string
    updatedAt?: DateTimeFilter<"Transaction"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type TransactionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    stripePaymentId?: SortOrder
    stripeCustomerId?: SortOrderInput | SortOrder
    amountCents?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    processedAt?: SortOrderInput | SortOrder
    idempotencyKey?: SortOrder
    productType?: SortOrder
    productData?: SortOrder
    fulfilled?: SortOrder
    fulfilledAt?: SortOrderInput | SortOrder
    fulfillmentJobId?: SortOrderInput | SortOrder
    lastError?: SortOrderInput | SortOrder
    retryCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type TransactionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    stripePaymentId?: string
    idempotencyKey?: string
    AND?: TransactionWhereInput | TransactionWhereInput[]
    OR?: TransactionWhereInput[]
    NOT?: TransactionWhereInput | TransactionWhereInput[]
    userId?: StringFilter<"Transaction"> | string
    stripeCustomerId?: StringNullableFilter<"Transaction"> | string | null
    amountCents?: IntFilter<"Transaction"> | number
    currency?: StringFilter<"Transaction"> | string
    status?: EnumTransactionStatusFilter<"Transaction"> | $Enums.TransactionStatus
    processedAt?: DateTimeNullableFilter<"Transaction"> | Date | string | null
    productType?: EnumProductTypeFilter<"Transaction"> | $Enums.ProductType
    productData?: JsonFilter<"Transaction">
    fulfilled?: BoolFilter<"Transaction"> | boolean
    fulfilledAt?: DateTimeNullableFilter<"Transaction"> | Date | string | null
    fulfillmentJobId?: StringNullableFilter<"Transaction"> | string | null
    lastError?: StringNullableFilter<"Transaction"> | string | null
    retryCount?: IntFilter<"Transaction"> | number
    createdAt?: DateTimeFilter<"Transaction"> | Date | string
    updatedAt?: DateTimeFilter<"Transaction"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id" | "stripePaymentId" | "idempotencyKey">

  export type TransactionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    stripePaymentId?: SortOrder
    stripeCustomerId?: SortOrderInput | SortOrder
    amountCents?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    processedAt?: SortOrderInput | SortOrder
    idempotencyKey?: SortOrder
    productType?: SortOrder
    productData?: SortOrder
    fulfilled?: SortOrder
    fulfilledAt?: SortOrderInput | SortOrder
    fulfillmentJobId?: SortOrderInput | SortOrder
    lastError?: SortOrderInput | SortOrder
    retryCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TransactionCountOrderByAggregateInput
    _avg?: TransactionAvgOrderByAggregateInput
    _max?: TransactionMaxOrderByAggregateInput
    _min?: TransactionMinOrderByAggregateInput
    _sum?: TransactionSumOrderByAggregateInput
  }

  export type TransactionScalarWhereWithAggregatesInput = {
    AND?: TransactionScalarWhereWithAggregatesInput | TransactionScalarWhereWithAggregatesInput[]
    OR?: TransactionScalarWhereWithAggregatesInput[]
    NOT?: TransactionScalarWhereWithAggregatesInput | TransactionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Transaction"> | string
    userId?: StringWithAggregatesFilter<"Transaction"> | string
    stripePaymentId?: StringWithAggregatesFilter<"Transaction"> | string
    stripeCustomerId?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
    amountCents?: IntWithAggregatesFilter<"Transaction"> | number
    currency?: StringWithAggregatesFilter<"Transaction"> | string
    status?: EnumTransactionStatusWithAggregatesFilter<"Transaction"> | $Enums.TransactionStatus
    processedAt?: DateTimeNullableWithAggregatesFilter<"Transaction"> | Date | string | null
    idempotencyKey?: StringWithAggregatesFilter<"Transaction"> | string
    productType?: EnumProductTypeWithAggregatesFilter<"Transaction"> | $Enums.ProductType
    productData?: JsonWithAggregatesFilter<"Transaction">
    fulfilled?: BoolWithAggregatesFilter<"Transaction"> | boolean
    fulfilledAt?: DateTimeNullableWithAggregatesFilter<"Transaction"> | Date | string | null
    fulfillmentJobId?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
    lastError?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
    retryCount?: IntWithAggregatesFilter<"Transaction"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Transaction"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Transaction"> | Date | string
  }

  export type AchievementWhereInput = {
    AND?: AchievementWhereInput | AchievementWhereInput[]
    OR?: AchievementWhereInput[]
    NOT?: AchievementWhereInput | AchievementWhereInput[]
    id?: StringFilter<"Achievement"> | string
    slug?: StringFilter<"Achievement"> | string
    name?: StringFilter<"Achievement"> | string
    description?: StringFilter<"Achievement"> | string
    conditionType?: EnumAchievementConditionFilter<"Achievement"> | $Enums.AchievementCondition
    conditionValue?: DecimalFilter<"Achievement"> | Decimal | DecimalJsLike | number | string
    rewardLoC?: DecimalNullableFilter<"Achievement"> | Decimal | DecimalJsLike | number | string | null
    rewardExp?: DecimalNullableFilter<"Achievement"> | Decimal | DecimalJsLike | number | string | null
    rewardItemSlug?: StringNullableFilter<"Achievement"> | string | null
    iconUrl?: StringNullableFilter<"Achievement"> | string | null
    points?: IntFilter<"Achievement"> | number
    hidden?: BoolFilter<"Achievement"> | boolean
    createdAt?: DateTimeFilter<"Achievement"> | Date | string
    updatedAt?: DateTimeFilter<"Achievement"> | Date | string
    userAchievements?: UserAchievementListRelationFilter
  }

  export type AchievementOrderByWithRelationInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    description?: SortOrder
    conditionType?: SortOrder
    conditionValue?: SortOrder
    rewardLoC?: SortOrderInput | SortOrder
    rewardExp?: SortOrderInput | SortOrder
    rewardItemSlug?: SortOrderInput | SortOrder
    iconUrl?: SortOrderInput | SortOrder
    points?: SortOrder
    hidden?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userAchievements?: UserAchievementOrderByRelationAggregateInput
  }

  export type AchievementWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: AchievementWhereInput | AchievementWhereInput[]
    OR?: AchievementWhereInput[]
    NOT?: AchievementWhereInput | AchievementWhereInput[]
    name?: StringFilter<"Achievement"> | string
    description?: StringFilter<"Achievement"> | string
    conditionType?: EnumAchievementConditionFilter<"Achievement"> | $Enums.AchievementCondition
    conditionValue?: DecimalFilter<"Achievement"> | Decimal | DecimalJsLike | number | string
    rewardLoC?: DecimalNullableFilter<"Achievement"> | Decimal | DecimalJsLike | number | string | null
    rewardExp?: DecimalNullableFilter<"Achievement"> | Decimal | DecimalJsLike | number | string | null
    rewardItemSlug?: StringNullableFilter<"Achievement"> | string | null
    iconUrl?: StringNullableFilter<"Achievement"> | string | null
    points?: IntFilter<"Achievement"> | number
    hidden?: BoolFilter<"Achievement"> | boolean
    createdAt?: DateTimeFilter<"Achievement"> | Date | string
    updatedAt?: DateTimeFilter<"Achievement"> | Date | string
    userAchievements?: UserAchievementListRelationFilter
  }, "id" | "slug">

  export type AchievementOrderByWithAggregationInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    description?: SortOrder
    conditionType?: SortOrder
    conditionValue?: SortOrder
    rewardLoC?: SortOrderInput | SortOrder
    rewardExp?: SortOrderInput | SortOrder
    rewardItemSlug?: SortOrderInput | SortOrder
    iconUrl?: SortOrderInput | SortOrder
    points?: SortOrder
    hidden?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AchievementCountOrderByAggregateInput
    _avg?: AchievementAvgOrderByAggregateInput
    _max?: AchievementMaxOrderByAggregateInput
    _min?: AchievementMinOrderByAggregateInput
    _sum?: AchievementSumOrderByAggregateInput
  }

  export type AchievementScalarWhereWithAggregatesInput = {
    AND?: AchievementScalarWhereWithAggregatesInput | AchievementScalarWhereWithAggregatesInput[]
    OR?: AchievementScalarWhereWithAggregatesInput[]
    NOT?: AchievementScalarWhereWithAggregatesInput | AchievementScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Achievement"> | string
    slug?: StringWithAggregatesFilter<"Achievement"> | string
    name?: StringWithAggregatesFilter<"Achievement"> | string
    description?: StringWithAggregatesFilter<"Achievement"> | string
    conditionType?: EnumAchievementConditionWithAggregatesFilter<"Achievement"> | $Enums.AchievementCondition
    conditionValue?: DecimalWithAggregatesFilter<"Achievement"> | Decimal | DecimalJsLike | number | string
    rewardLoC?: DecimalNullableWithAggregatesFilter<"Achievement"> | Decimal | DecimalJsLike | number | string | null
    rewardExp?: DecimalNullableWithAggregatesFilter<"Achievement"> | Decimal | DecimalJsLike | number | string | null
    rewardItemSlug?: StringNullableWithAggregatesFilter<"Achievement"> | string | null
    iconUrl?: StringNullableWithAggregatesFilter<"Achievement"> | string | null
    points?: IntWithAggregatesFilter<"Achievement"> | number
    hidden?: BoolWithAggregatesFilter<"Achievement"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Achievement"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Achievement"> | Date | string
  }

  export type UserAchievementWhereInput = {
    AND?: UserAchievementWhereInput | UserAchievementWhereInput[]
    OR?: UserAchievementWhereInput[]
    NOT?: UserAchievementWhereInput | UserAchievementWhereInput[]
    id?: StringFilter<"UserAchievement"> | string
    userId?: StringFilter<"UserAchievement"> | string
    achievementId?: StringFilter<"UserAchievement"> | string
    unlockedAt?: DateTimeFilter<"UserAchievement"> | Date | string
    claimed?: BoolFilter<"UserAchievement"> | boolean
    claimedAt?: DateTimeNullableFilter<"UserAchievement"> | Date | string | null
    user?: XOR<UserRelationFilter, UserWhereInput>
    achievement?: XOR<AchievementRelationFilter, AchievementWhereInput>
  }

  export type UserAchievementOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    achievementId?: SortOrder
    unlockedAt?: SortOrder
    claimed?: SortOrder
    claimedAt?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    achievement?: AchievementOrderByWithRelationInput
  }

  export type UserAchievementWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_achievementId?: UserAchievementUserIdAchievementIdCompoundUniqueInput
    AND?: UserAchievementWhereInput | UserAchievementWhereInput[]
    OR?: UserAchievementWhereInput[]
    NOT?: UserAchievementWhereInput | UserAchievementWhereInput[]
    userId?: StringFilter<"UserAchievement"> | string
    achievementId?: StringFilter<"UserAchievement"> | string
    unlockedAt?: DateTimeFilter<"UserAchievement"> | Date | string
    claimed?: BoolFilter<"UserAchievement"> | boolean
    claimedAt?: DateTimeNullableFilter<"UserAchievement"> | Date | string | null
    user?: XOR<UserRelationFilter, UserWhereInput>
    achievement?: XOR<AchievementRelationFilter, AchievementWhereInput>
  }, "id" | "userId_achievementId">

  export type UserAchievementOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    achievementId?: SortOrder
    unlockedAt?: SortOrder
    claimed?: SortOrder
    claimedAt?: SortOrderInput | SortOrder
    _count?: UserAchievementCountOrderByAggregateInput
    _max?: UserAchievementMaxOrderByAggregateInput
    _min?: UserAchievementMinOrderByAggregateInput
  }

  export type UserAchievementScalarWhereWithAggregatesInput = {
    AND?: UserAchievementScalarWhereWithAggregatesInput | UserAchievementScalarWhereWithAggregatesInput[]
    OR?: UserAchievementScalarWhereWithAggregatesInput[]
    NOT?: UserAchievementScalarWhereWithAggregatesInput | UserAchievementScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserAchievement"> | string
    userId?: StringWithAggregatesFilter<"UserAchievement"> | string
    achievementId?: StringWithAggregatesFilter<"UserAchievement"> | string
    unlockedAt?: DateTimeWithAggregatesFilter<"UserAchievement"> | Date | string
    claimed?: BoolWithAggregatesFilter<"UserAchievement"> | boolean
    claimedAt?: DateTimeNullableWithAggregatesFilter<"UserAchievement"> | Date | string | null
  }

  export type OfflineSessionWhereInput = {
    AND?: OfflineSessionWhereInput | OfflineSessionWhereInput[]
    OR?: OfflineSessionWhereInput[]
    NOT?: OfflineSessionWhereInput | OfflineSessionWhereInput[]
    id?: StringFilter<"OfflineSession"> | string
    userId?: StringFilter<"OfflineSession"> | string
    disconnectedAt?: DateTimeFilter<"OfflineSession"> | Date | string
    reconnectedAt?: DateTimeNullableFilter<"OfflineSession"> | Date | string | null
    earnedLoC?: DecimalNullableFilter<"OfflineSession"> | Decimal | DecimalJsLike | number | string | null
    earnedExp?: DecimalNullableFilter<"OfflineSession"> | Decimal | DecimalJsLike | number | string | null
    processed?: BoolFilter<"OfflineSession"> | boolean
    createdAt?: DateTimeFilter<"OfflineSession"> | Date | string
  }

  export type OfflineSessionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    disconnectedAt?: SortOrder
    reconnectedAt?: SortOrderInput | SortOrder
    earnedLoC?: SortOrderInput | SortOrder
    earnedExp?: SortOrderInput | SortOrder
    processed?: SortOrder
    createdAt?: SortOrder
  }

  export type OfflineSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: OfflineSessionWhereInput | OfflineSessionWhereInput[]
    OR?: OfflineSessionWhereInput[]
    NOT?: OfflineSessionWhereInput | OfflineSessionWhereInput[]
    userId?: StringFilter<"OfflineSession"> | string
    disconnectedAt?: DateTimeFilter<"OfflineSession"> | Date | string
    reconnectedAt?: DateTimeNullableFilter<"OfflineSession"> | Date | string | null
    earnedLoC?: DecimalNullableFilter<"OfflineSession"> | Decimal | DecimalJsLike | number | string | null
    earnedExp?: DecimalNullableFilter<"OfflineSession"> | Decimal | DecimalJsLike | number | string | null
    processed?: BoolFilter<"OfflineSession"> | boolean
    createdAt?: DateTimeFilter<"OfflineSession"> | Date | string
  }, "id">

  export type OfflineSessionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    disconnectedAt?: SortOrder
    reconnectedAt?: SortOrderInput | SortOrder
    earnedLoC?: SortOrderInput | SortOrder
    earnedExp?: SortOrderInput | SortOrder
    processed?: SortOrder
    createdAt?: SortOrder
    _count?: OfflineSessionCountOrderByAggregateInput
    _avg?: OfflineSessionAvgOrderByAggregateInput
    _max?: OfflineSessionMaxOrderByAggregateInput
    _min?: OfflineSessionMinOrderByAggregateInput
    _sum?: OfflineSessionSumOrderByAggregateInput
  }

  export type OfflineSessionScalarWhereWithAggregatesInput = {
    AND?: OfflineSessionScalarWhereWithAggregatesInput | OfflineSessionScalarWhereWithAggregatesInput[]
    OR?: OfflineSessionScalarWhereWithAggregatesInput[]
    NOT?: OfflineSessionScalarWhereWithAggregatesInput | OfflineSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"OfflineSession"> | string
    userId?: StringWithAggregatesFilter<"OfflineSession"> | string
    disconnectedAt?: DateTimeWithAggregatesFilter<"OfflineSession"> | Date | string
    reconnectedAt?: DateTimeNullableWithAggregatesFilter<"OfflineSession"> | Date | string | null
    earnedLoC?: DecimalNullableWithAggregatesFilter<"OfflineSession"> | Decimal | DecimalJsLike | number | string | null
    earnedExp?: DecimalNullableWithAggregatesFilter<"OfflineSession"> | Decimal | DecimalJsLike | number | string | null
    processed?: BoolWithAggregatesFilter<"OfflineSession"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"OfflineSession"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    username: string
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastLoginAt?: Date | string | null
    lastActiveAt?: Date | string | null
    progression?: ProgressionCreateNestedOneWithoutUserInput
    ownedItems?: OwnedItemCreateNestedManyWithoutUserInput
    activePrograms?: ActiveProgramCreateNestedManyWithoutUserInput
    transactions?: TransactionCreateNestedManyWithoutUserInput
    achievements?: UserAchievementCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    username: string
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastLoginAt?: Date | string | null
    lastActiveAt?: Date | string | null
    progression?: ProgressionUncheckedCreateNestedOneWithoutUserInput
    ownedItems?: OwnedItemUncheckedCreateNestedManyWithoutUserInput
    activePrograms?: ActiveProgramUncheckedCreateNestedManyWithoutUserInput
    transactions?: TransactionUncheckedCreateNestedManyWithoutUserInput
    achievements?: UserAchievementUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastActiveAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    progression?: ProgressionUpdateOneWithoutUserNestedInput
    ownedItems?: OwnedItemUpdateManyWithoutUserNestedInput
    activePrograms?: ActiveProgramUpdateManyWithoutUserNestedInput
    transactions?: TransactionUpdateManyWithoutUserNestedInput
    achievements?: UserAchievementUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastActiveAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    progression?: ProgressionUncheckedUpdateOneWithoutUserNestedInput
    ownedItems?: OwnedItemUncheckedUpdateManyWithoutUserNestedInput
    activePrograms?: ActiveProgramUncheckedUpdateManyWithoutUserNestedInput
    transactions?: TransactionUncheckedUpdateManyWithoutUserNestedInput
    achievements?: UserAchievementUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    username: string
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastLoginAt?: Date | string | null
    lastActiveAt?: Date | string | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastActiveAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastActiveAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ProgressionCreateInput = {
    id?: string
    linesOfCode?: Decimal | DecimalJsLike | number | string
    totalLinesWritten?: Decimal | DecimalJsLike | number | string
    clickMultiplier?: number
    passiveMultiplier?: number
    criticalChance?: number
    criticalMultiplier?: number
    level?: number
    experience?: Decimal | DecimalJsLike | number | string
    experienceToNext?: Decimal | DecimalJsLike | number | string
    prestigeLevel?: number
    prestigePoints?: Decimal | DecimalJsLike | number | string
    totalClicks?: bigint | number
    totalPlaytimeSeconds?: bigint | number
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutProgressionInput
  }

  export type ProgressionUncheckedCreateInput = {
    id?: string
    userId: string
    linesOfCode?: Decimal | DecimalJsLike | number | string
    totalLinesWritten?: Decimal | DecimalJsLike | number | string
    clickMultiplier?: number
    passiveMultiplier?: number
    criticalChance?: number
    criticalMultiplier?: number
    level?: number
    experience?: Decimal | DecimalJsLike | number | string
    experienceToNext?: Decimal | DecimalJsLike | number | string
    prestigeLevel?: number
    prestigePoints?: Decimal | DecimalJsLike | number | string
    totalClicks?: bigint | number
    totalPlaytimeSeconds?: bigint | number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProgressionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    linesOfCode?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalLinesWritten?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    clickMultiplier?: FloatFieldUpdateOperationsInput | number
    passiveMultiplier?: FloatFieldUpdateOperationsInput | number
    criticalChance?: FloatFieldUpdateOperationsInput | number
    criticalMultiplier?: FloatFieldUpdateOperationsInput | number
    level?: IntFieldUpdateOperationsInput | number
    experience?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    experienceToNext?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    prestigeLevel?: IntFieldUpdateOperationsInput | number
    prestigePoints?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalClicks?: BigIntFieldUpdateOperationsInput | bigint | number
    totalPlaytimeSeconds?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutProgressionNestedInput
  }

  export type ProgressionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    linesOfCode?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalLinesWritten?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    clickMultiplier?: FloatFieldUpdateOperationsInput | number
    passiveMultiplier?: FloatFieldUpdateOperationsInput | number
    criticalChance?: FloatFieldUpdateOperationsInput | number
    criticalMultiplier?: FloatFieldUpdateOperationsInput | number
    level?: IntFieldUpdateOperationsInput | number
    experience?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    experienceToNext?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    prestigeLevel?: IntFieldUpdateOperationsInput | number
    prestigePoints?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalClicks?: BigIntFieldUpdateOperationsInput | bigint | number
    totalPlaytimeSeconds?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProgressionCreateManyInput = {
    id?: string
    userId: string
    linesOfCode?: Decimal | DecimalJsLike | number | string
    totalLinesWritten?: Decimal | DecimalJsLike | number | string
    clickMultiplier?: number
    passiveMultiplier?: number
    criticalChance?: number
    criticalMultiplier?: number
    level?: number
    experience?: Decimal | DecimalJsLike | number | string
    experienceToNext?: Decimal | DecimalJsLike | number | string
    prestigeLevel?: number
    prestigePoints?: Decimal | DecimalJsLike | number | string
    totalClicks?: bigint | number
    totalPlaytimeSeconds?: bigint | number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProgressionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    linesOfCode?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalLinesWritten?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    clickMultiplier?: FloatFieldUpdateOperationsInput | number
    passiveMultiplier?: FloatFieldUpdateOperationsInput | number
    criticalChance?: FloatFieldUpdateOperationsInput | number
    criticalMultiplier?: FloatFieldUpdateOperationsInput | number
    level?: IntFieldUpdateOperationsInput | number
    experience?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    experienceToNext?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    prestigeLevel?: IntFieldUpdateOperationsInput | number
    prestigePoints?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalClicks?: BigIntFieldUpdateOperationsInput | bigint | number
    totalPlaytimeSeconds?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProgressionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    linesOfCode?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalLinesWritten?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    clickMultiplier?: FloatFieldUpdateOperationsInput | number
    passiveMultiplier?: FloatFieldUpdateOperationsInput | number
    criticalChance?: FloatFieldUpdateOperationsInput | number
    criticalMultiplier?: FloatFieldUpdateOperationsInput | number
    level?: IntFieldUpdateOperationsInput | number
    experience?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    experienceToNext?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    prestigeLevel?: IntFieldUpdateOperationsInput | number
    prestigePoints?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalClicks?: BigIntFieldUpdateOperationsInput | bigint | number
    totalPlaytimeSeconds?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemCreateInput = {
    id?: string
    slug: string
    name: string
    description: string
    category: $Enums.ItemCategory
    baseCost: Decimal | DecimalJsLike | number | string
    baseEffect: number
    effectType: $Enums.EffectType
    costMultiplier?: number
    maxQuantity?: number | null
    unlockLevel?: number
    unlockItemSlug?: string | null
    iconUrl?: string | null
    rarity?: $Enums.Rarity
    createdAt?: Date | string
    updatedAt?: Date | string
    ownedItems?: OwnedItemCreateNestedManyWithoutItemInput
  }

  export type ItemUncheckedCreateInput = {
    id?: string
    slug: string
    name: string
    description: string
    category: $Enums.ItemCategory
    baseCost: Decimal | DecimalJsLike | number | string
    baseEffect: number
    effectType: $Enums.EffectType
    costMultiplier?: number
    maxQuantity?: number | null
    unlockLevel?: number
    unlockItemSlug?: string | null
    iconUrl?: string | null
    rarity?: $Enums.Rarity
    createdAt?: Date | string
    updatedAt?: Date | string
    ownedItems?: OwnedItemUncheckedCreateNestedManyWithoutItemInput
  }

  export type ItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: EnumItemCategoryFieldUpdateOperationsInput | $Enums.ItemCategory
    baseCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    baseEffect?: FloatFieldUpdateOperationsInput | number
    effectType?: EnumEffectTypeFieldUpdateOperationsInput | $Enums.EffectType
    costMultiplier?: FloatFieldUpdateOperationsInput | number
    maxQuantity?: NullableIntFieldUpdateOperationsInput | number | null
    unlockLevel?: IntFieldUpdateOperationsInput | number
    unlockItemSlug?: NullableStringFieldUpdateOperationsInput | string | null
    iconUrl?: NullableStringFieldUpdateOperationsInput | string | null
    rarity?: EnumRarityFieldUpdateOperationsInput | $Enums.Rarity
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownedItems?: OwnedItemUpdateManyWithoutItemNestedInput
  }

  export type ItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: EnumItemCategoryFieldUpdateOperationsInput | $Enums.ItemCategory
    baseCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    baseEffect?: FloatFieldUpdateOperationsInput | number
    effectType?: EnumEffectTypeFieldUpdateOperationsInput | $Enums.EffectType
    costMultiplier?: FloatFieldUpdateOperationsInput | number
    maxQuantity?: NullableIntFieldUpdateOperationsInput | number | null
    unlockLevel?: IntFieldUpdateOperationsInput | number
    unlockItemSlug?: NullableStringFieldUpdateOperationsInput | string | null
    iconUrl?: NullableStringFieldUpdateOperationsInput | string | null
    rarity?: EnumRarityFieldUpdateOperationsInput | $Enums.Rarity
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownedItems?: OwnedItemUncheckedUpdateManyWithoutItemNestedInput
  }

  export type ItemCreateManyInput = {
    id?: string
    slug: string
    name: string
    description: string
    category: $Enums.ItemCategory
    baseCost: Decimal | DecimalJsLike | number | string
    baseEffect: number
    effectType: $Enums.EffectType
    costMultiplier?: number
    maxQuantity?: number | null
    unlockLevel?: number
    unlockItemSlug?: string | null
    iconUrl?: string | null
    rarity?: $Enums.Rarity
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: EnumItemCategoryFieldUpdateOperationsInput | $Enums.ItemCategory
    baseCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    baseEffect?: FloatFieldUpdateOperationsInput | number
    effectType?: EnumEffectTypeFieldUpdateOperationsInput | $Enums.EffectType
    costMultiplier?: FloatFieldUpdateOperationsInput | number
    maxQuantity?: NullableIntFieldUpdateOperationsInput | number | null
    unlockLevel?: IntFieldUpdateOperationsInput | number
    unlockItemSlug?: NullableStringFieldUpdateOperationsInput | string | null
    iconUrl?: NullableStringFieldUpdateOperationsInput | string | null
    rarity?: EnumRarityFieldUpdateOperationsInput | $Enums.Rarity
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: EnumItemCategoryFieldUpdateOperationsInput | $Enums.ItemCategory
    baseCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    baseEffect?: FloatFieldUpdateOperationsInput | number
    effectType?: EnumEffectTypeFieldUpdateOperationsInput | $Enums.EffectType
    costMultiplier?: FloatFieldUpdateOperationsInput | number
    maxQuantity?: NullableIntFieldUpdateOperationsInput | number | null
    unlockLevel?: IntFieldUpdateOperationsInput | number
    unlockItemSlug?: NullableStringFieldUpdateOperationsInput | string | null
    iconUrl?: NullableStringFieldUpdateOperationsInput | string | null
    rarity?: EnumRarityFieldUpdateOperationsInput | $Enums.Rarity
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OwnedItemCreateInput = {
    id?: string
    quantity?: number
    level?: number
    purchasedAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutOwnedItemsInput
    item: ItemCreateNestedOneWithoutOwnedItemsInput
  }

  export type OwnedItemUncheckedCreateInput = {
    id?: string
    userId: string
    itemId: string
    quantity?: number
    level?: number
    purchasedAt?: Date | string
    updatedAt?: Date | string
  }

  export type OwnedItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    level?: IntFieldUpdateOperationsInput | number
    purchasedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutOwnedItemsNestedInput
    item?: ItemUpdateOneRequiredWithoutOwnedItemsNestedInput
  }

  export type OwnedItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    itemId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    level?: IntFieldUpdateOperationsInput | number
    purchasedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OwnedItemCreateManyInput = {
    id?: string
    userId: string
    itemId: string
    quantity?: number
    level?: number
    purchasedAt?: Date | string
    updatedAt?: Date | string
  }

  export type OwnedItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    level?: IntFieldUpdateOperationsInput | number
    purchasedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OwnedItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    itemId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    level?: IntFieldUpdateOperationsInput | number
    purchasedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProgramTypeCreateInput = {
    id?: string
    slug: string
    name: string
    description: string
    baseDurationSecs: number
    baseReward: Decimal | DecimalJsLike | number | string
    experienceReward: Decimal | DecimalJsLike | number | string
    rewardMultiplier?: number
    unlockLevel?: number
    lootTable?: NullableJsonNullValueInput | InputJsonValue
    iconUrl?: string | null
    category: $Enums.ProgramCategory
    createdAt?: Date | string
    updatedAt?: Date | string
    activePrograms?: ActiveProgramCreateNestedManyWithoutProgramTypeInput
  }

  export type ProgramTypeUncheckedCreateInput = {
    id?: string
    slug: string
    name: string
    description: string
    baseDurationSecs: number
    baseReward: Decimal | DecimalJsLike | number | string
    experienceReward: Decimal | DecimalJsLike | number | string
    rewardMultiplier?: number
    unlockLevel?: number
    lootTable?: NullableJsonNullValueInput | InputJsonValue
    iconUrl?: string | null
    category: $Enums.ProgramCategory
    createdAt?: Date | string
    updatedAt?: Date | string
    activePrograms?: ActiveProgramUncheckedCreateNestedManyWithoutProgramTypeInput
  }

  export type ProgramTypeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    baseDurationSecs?: IntFieldUpdateOperationsInput | number
    baseReward?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    experienceReward?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rewardMultiplier?: FloatFieldUpdateOperationsInput | number
    unlockLevel?: IntFieldUpdateOperationsInput | number
    lootTable?: NullableJsonNullValueInput | InputJsonValue
    iconUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: EnumProgramCategoryFieldUpdateOperationsInput | $Enums.ProgramCategory
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activePrograms?: ActiveProgramUpdateManyWithoutProgramTypeNestedInput
  }

  export type ProgramTypeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    baseDurationSecs?: IntFieldUpdateOperationsInput | number
    baseReward?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    experienceReward?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rewardMultiplier?: FloatFieldUpdateOperationsInput | number
    unlockLevel?: IntFieldUpdateOperationsInput | number
    lootTable?: NullableJsonNullValueInput | InputJsonValue
    iconUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: EnumProgramCategoryFieldUpdateOperationsInput | $Enums.ProgramCategory
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activePrograms?: ActiveProgramUncheckedUpdateManyWithoutProgramTypeNestedInput
  }

  export type ProgramTypeCreateManyInput = {
    id?: string
    slug: string
    name: string
    description: string
    baseDurationSecs: number
    baseReward: Decimal | DecimalJsLike | number | string
    experienceReward: Decimal | DecimalJsLike | number | string
    rewardMultiplier?: number
    unlockLevel?: number
    lootTable?: NullableJsonNullValueInput | InputJsonValue
    iconUrl?: string | null
    category: $Enums.ProgramCategory
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProgramTypeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    baseDurationSecs?: IntFieldUpdateOperationsInput | number
    baseReward?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    experienceReward?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rewardMultiplier?: FloatFieldUpdateOperationsInput | number
    unlockLevel?: IntFieldUpdateOperationsInput | number
    lootTable?: NullableJsonNullValueInput | InputJsonValue
    iconUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: EnumProgramCategoryFieldUpdateOperationsInput | $Enums.ProgramCategory
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProgramTypeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    baseDurationSecs?: IntFieldUpdateOperationsInput | number
    baseReward?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    experienceReward?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rewardMultiplier?: FloatFieldUpdateOperationsInput | number
    unlockLevel?: IntFieldUpdateOperationsInput | number
    lootTable?: NullableJsonNullValueInput | InputJsonValue
    iconUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: EnumProgramCategoryFieldUpdateOperationsInput | $Enums.ProgramCategory
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActiveProgramCreateInput = {
    id?: string
    startedAt?: Date | string
    estimatedEndAt: Date | string
    completedAt?: Date | string | null
    status?: $Enums.ProgramStatus
    bullJobId?: string | null
    earnedReward?: Decimal | DecimalJsLike | number | string | null
    earnedExp?: Decimal | DecimalJsLike | number | string | null
    lootItems?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutActiveProgramsInput
    programType: ProgramTypeCreateNestedOneWithoutActiveProgramsInput
  }

  export type ActiveProgramUncheckedCreateInput = {
    id?: string
    userId: string
    programTypeId: string
    startedAt?: Date | string
    estimatedEndAt: Date | string
    completedAt?: Date | string | null
    status?: $Enums.ProgramStatus
    bullJobId?: string | null
    earnedReward?: Decimal | DecimalJsLike | number | string | null
    earnedExp?: Decimal | DecimalJsLike | number | string | null
    lootItems?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ActiveProgramUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    estimatedEndAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumProgramStatusFieldUpdateOperationsInput | $Enums.ProgramStatus
    bullJobId?: NullableStringFieldUpdateOperationsInput | string | null
    earnedReward?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    earnedExp?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lootItems?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutActiveProgramsNestedInput
    programType?: ProgramTypeUpdateOneRequiredWithoutActiveProgramsNestedInput
  }

  export type ActiveProgramUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    programTypeId?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    estimatedEndAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumProgramStatusFieldUpdateOperationsInput | $Enums.ProgramStatus
    bullJobId?: NullableStringFieldUpdateOperationsInput | string | null
    earnedReward?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    earnedExp?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lootItems?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActiveProgramCreateManyInput = {
    id?: string
    userId: string
    programTypeId: string
    startedAt?: Date | string
    estimatedEndAt: Date | string
    completedAt?: Date | string | null
    status?: $Enums.ProgramStatus
    bullJobId?: string | null
    earnedReward?: Decimal | DecimalJsLike | number | string | null
    earnedExp?: Decimal | DecimalJsLike | number | string | null
    lootItems?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ActiveProgramUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    estimatedEndAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumProgramStatusFieldUpdateOperationsInput | $Enums.ProgramStatus
    bullJobId?: NullableStringFieldUpdateOperationsInput | string | null
    earnedReward?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    earnedExp?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lootItems?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActiveProgramUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    programTypeId?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    estimatedEndAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumProgramStatusFieldUpdateOperationsInput | $Enums.ProgramStatus
    bullJobId?: NullableStringFieldUpdateOperationsInput | string | null
    earnedReward?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    earnedExp?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lootItems?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionCreateInput = {
    id?: string
    stripePaymentId: string
    stripeCustomerId?: string | null
    amountCents: number
    currency?: string
    status?: $Enums.TransactionStatus
    processedAt?: Date | string | null
    idempotencyKey: string
    productType: $Enums.ProductType
    productData: JsonNullValueInput | InputJsonValue
    fulfilled?: boolean
    fulfilledAt?: Date | string | null
    fulfillmentJobId?: string | null
    lastError?: string | null
    retryCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutTransactionsInput
  }

  export type TransactionUncheckedCreateInput = {
    id?: string
    userId: string
    stripePaymentId: string
    stripeCustomerId?: string | null
    amountCents: number
    currency?: string
    status?: $Enums.TransactionStatus
    processedAt?: Date | string | null
    idempotencyKey: string
    productType: $Enums.ProductType
    productData: JsonNullValueInput | InputJsonValue
    fulfilled?: boolean
    fulfilledAt?: Date | string | null
    fulfillmentJobId?: string | null
    lastError?: string | null
    retryCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripePaymentId?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    amountCents?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    productType?: EnumProductTypeFieldUpdateOperationsInput | $Enums.ProductType
    productData?: JsonNullValueInput | InputJsonValue
    fulfilled?: BoolFieldUpdateOperationsInput | boolean
    fulfilledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fulfillmentJobId?: NullableStringFieldUpdateOperationsInput | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    retryCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutTransactionsNestedInput
  }

  export type TransactionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    stripePaymentId?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    amountCents?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    productType?: EnumProductTypeFieldUpdateOperationsInput | $Enums.ProductType
    productData?: JsonNullValueInput | InputJsonValue
    fulfilled?: BoolFieldUpdateOperationsInput | boolean
    fulfilledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fulfillmentJobId?: NullableStringFieldUpdateOperationsInput | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    retryCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionCreateManyInput = {
    id?: string
    userId: string
    stripePaymentId: string
    stripeCustomerId?: string | null
    amountCents: number
    currency?: string
    status?: $Enums.TransactionStatus
    processedAt?: Date | string | null
    idempotencyKey: string
    productType: $Enums.ProductType
    productData: JsonNullValueInput | InputJsonValue
    fulfilled?: boolean
    fulfilledAt?: Date | string | null
    fulfillmentJobId?: string | null
    lastError?: string | null
    retryCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripePaymentId?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    amountCents?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    productType?: EnumProductTypeFieldUpdateOperationsInput | $Enums.ProductType
    productData?: JsonNullValueInput | InputJsonValue
    fulfilled?: BoolFieldUpdateOperationsInput | boolean
    fulfilledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fulfillmentJobId?: NullableStringFieldUpdateOperationsInput | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    retryCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    stripePaymentId?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    amountCents?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    productType?: EnumProductTypeFieldUpdateOperationsInput | $Enums.ProductType
    productData?: JsonNullValueInput | InputJsonValue
    fulfilled?: BoolFieldUpdateOperationsInput | boolean
    fulfilledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fulfillmentJobId?: NullableStringFieldUpdateOperationsInput | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    retryCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AchievementCreateInput = {
    id?: string
    slug: string
    name: string
    description: string
    conditionType: $Enums.AchievementCondition
    conditionValue: Decimal | DecimalJsLike | number | string
    rewardLoC?: Decimal | DecimalJsLike | number | string | null
    rewardExp?: Decimal | DecimalJsLike | number | string | null
    rewardItemSlug?: string | null
    iconUrl?: string | null
    points?: number
    hidden?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    userAchievements?: UserAchievementCreateNestedManyWithoutAchievementInput
  }

  export type AchievementUncheckedCreateInput = {
    id?: string
    slug: string
    name: string
    description: string
    conditionType: $Enums.AchievementCondition
    conditionValue: Decimal | DecimalJsLike | number | string
    rewardLoC?: Decimal | DecimalJsLike | number | string | null
    rewardExp?: Decimal | DecimalJsLike | number | string | null
    rewardItemSlug?: string | null
    iconUrl?: string | null
    points?: number
    hidden?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    userAchievements?: UserAchievementUncheckedCreateNestedManyWithoutAchievementInput
  }

  export type AchievementUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    conditionType?: EnumAchievementConditionFieldUpdateOperationsInput | $Enums.AchievementCondition
    conditionValue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rewardLoC?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    rewardExp?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    rewardItemSlug?: NullableStringFieldUpdateOperationsInput | string | null
    iconUrl?: NullableStringFieldUpdateOperationsInput | string | null
    points?: IntFieldUpdateOperationsInput | number
    hidden?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userAchievements?: UserAchievementUpdateManyWithoutAchievementNestedInput
  }

  export type AchievementUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    conditionType?: EnumAchievementConditionFieldUpdateOperationsInput | $Enums.AchievementCondition
    conditionValue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rewardLoC?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    rewardExp?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    rewardItemSlug?: NullableStringFieldUpdateOperationsInput | string | null
    iconUrl?: NullableStringFieldUpdateOperationsInput | string | null
    points?: IntFieldUpdateOperationsInput | number
    hidden?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userAchievements?: UserAchievementUncheckedUpdateManyWithoutAchievementNestedInput
  }

  export type AchievementCreateManyInput = {
    id?: string
    slug: string
    name: string
    description: string
    conditionType: $Enums.AchievementCondition
    conditionValue: Decimal | DecimalJsLike | number | string
    rewardLoC?: Decimal | DecimalJsLike | number | string | null
    rewardExp?: Decimal | DecimalJsLike | number | string | null
    rewardItemSlug?: string | null
    iconUrl?: string | null
    points?: number
    hidden?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AchievementUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    conditionType?: EnumAchievementConditionFieldUpdateOperationsInput | $Enums.AchievementCondition
    conditionValue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rewardLoC?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    rewardExp?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    rewardItemSlug?: NullableStringFieldUpdateOperationsInput | string | null
    iconUrl?: NullableStringFieldUpdateOperationsInput | string | null
    points?: IntFieldUpdateOperationsInput | number
    hidden?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AchievementUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    conditionType?: EnumAchievementConditionFieldUpdateOperationsInput | $Enums.AchievementCondition
    conditionValue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rewardLoC?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    rewardExp?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    rewardItemSlug?: NullableStringFieldUpdateOperationsInput | string | null
    iconUrl?: NullableStringFieldUpdateOperationsInput | string | null
    points?: IntFieldUpdateOperationsInput | number
    hidden?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserAchievementCreateInput = {
    id?: string
    unlockedAt?: Date | string
    claimed?: boolean
    claimedAt?: Date | string | null
    user: UserCreateNestedOneWithoutAchievementsInput
    achievement: AchievementCreateNestedOneWithoutUserAchievementsInput
  }

  export type UserAchievementUncheckedCreateInput = {
    id?: string
    userId: string
    achievementId: string
    unlockedAt?: Date | string
    claimed?: boolean
    claimedAt?: Date | string | null
  }

  export type UserAchievementUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    unlockedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    claimed?: BoolFieldUpdateOperationsInput | boolean
    claimedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutAchievementsNestedInput
    achievement?: AchievementUpdateOneRequiredWithoutUserAchievementsNestedInput
  }

  export type UserAchievementUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    achievementId?: StringFieldUpdateOperationsInput | string
    unlockedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    claimed?: BoolFieldUpdateOperationsInput | boolean
    claimedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserAchievementCreateManyInput = {
    id?: string
    userId: string
    achievementId: string
    unlockedAt?: Date | string
    claimed?: boolean
    claimedAt?: Date | string | null
  }

  export type UserAchievementUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    unlockedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    claimed?: BoolFieldUpdateOperationsInput | boolean
    claimedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserAchievementUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    achievementId?: StringFieldUpdateOperationsInput | string
    unlockedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    claimed?: BoolFieldUpdateOperationsInput | boolean
    claimedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type OfflineSessionCreateInput = {
    id?: string
    userId: string
    disconnectedAt: Date | string
    reconnectedAt?: Date | string | null
    earnedLoC?: Decimal | DecimalJsLike | number | string | null
    earnedExp?: Decimal | DecimalJsLike | number | string | null
    processed?: boolean
    createdAt?: Date | string
  }

  export type OfflineSessionUncheckedCreateInput = {
    id?: string
    userId: string
    disconnectedAt: Date | string
    reconnectedAt?: Date | string | null
    earnedLoC?: Decimal | DecimalJsLike | number | string | null
    earnedExp?: Decimal | DecimalJsLike | number | string | null
    processed?: boolean
    createdAt?: Date | string
  }

  export type OfflineSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    disconnectedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reconnectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    earnedLoC?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    earnedExp?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    processed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OfflineSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    disconnectedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reconnectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    earnedLoC?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    earnedExp?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    processed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OfflineSessionCreateManyInput = {
    id?: string
    userId: string
    disconnectedAt: Date | string
    reconnectedAt?: Date | string | null
    earnedLoC?: Decimal | DecimalJsLike | number | string | null
    earnedExp?: Decimal | DecimalJsLike | number | string | null
    processed?: boolean
    createdAt?: Date | string
  }

  export type OfflineSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    disconnectedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reconnectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    earnedLoC?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    earnedExp?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    processed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OfflineSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    disconnectedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reconnectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    earnedLoC?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    earnedExp?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    processed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type ProgressionNullableRelationFilter = {
    is?: ProgressionWhereInput | null
    isNot?: ProgressionWhereInput | null
  }

  export type OwnedItemListRelationFilter = {
    every?: OwnedItemWhereInput
    some?: OwnedItemWhereInput
    none?: OwnedItemWhereInput
  }

  export type ActiveProgramListRelationFilter = {
    every?: ActiveProgramWhereInput
    some?: ActiveProgramWhereInput
    none?: ActiveProgramWhereInput
  }

  export type TransactionListRelationFilter = {
    every?: TransactionWhereInput
    some?: TransactionWhereInput
    none?: TransactionWhereInput
  }

  export type UserAchievementListRelationFilter = {
    every?: UserAchievementWhereInput
    some?: UserAchievementWhereInput
    none?: UserAchievementWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type OwnedItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ActiveProgramOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TransactionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserAchievementOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastLoginAt?: SortOrder
    lastActiveAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastLoginAt?: SortOrder
    lastActiveAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastLoginAt?: SortOrder
    lastActiveAt?: SortOrder
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

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
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

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type ProgressionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    linesOfCode?: SortOrder
    totalLinesWritten?: SortOrder
    clickMultiplier?: SortOrder
    passiveMultiplier?: SortOrder
    criticalChance?: SortOrder
    criticalMultiplier?: SortOrder
    level?: SortOrder
    experience?: SortOrder
    experienceToNext?: SortOrder
    prestigeLevel?: SortOrder
    prestigePoints?: SortOrder
    totalClicks?: SortOrder
    totalPlaytimeSeconds?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProgressionAvgOrderByAggregateInput = {
    linesOfCode?: SortOrder
    totalLinesWritten?: SortOrder
    clickMultiplier?: SortOrder
    passiveMultiplier?: SortOrder
    criticalChance?: SortOrder
    criticalMultiplier?: SortOrder
    level?: SortOrder
    experience?: SortOrder
    experienceToNext?: SortOrder
    prestigeLevel?: SortOrder
    prestigePoints?: SortOrder
    totalClicks?: SortOrder
    totalPlaytimeSeconds?: SortOrder
  }

  export type ProgressionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    linesOfCode?: SortOrder
    totalLinesWritten?: SortOrder
    clickMultiplier?: SortOrder
    passiveMultiplier?: SortOrder
    criticalChance?: SortOrder
    criticalMultiplier?: SortOrder
    level?: SortOrder
    experience?: SortOrder
    experienceToNext?: SortOrder
    prestigeLevel?: SortOrder
    prestigePoints?: SortOrder
    totalClicks?: SortOrder
    totalPlaytimeSeconds?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProgressionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    linesOfCode?: SortOrder
    totalLinesWritten?: SortOrder
    clickMultiplier?: SortOrder
    passiveMultiplier?: SortOrder
    criticalChance?: SortOrder
    criticalMultiplier?: SortOrder
    level?: SortOrder
    experience?: SortOrder
    experienceToNext?: SortOrder
    prestigeLevel?: SortOrder
    prestigePoints?: SortOrder
    totalClicks?: SortOrder
    totalPlaytimeSeconds?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProgressionSumOrderByAggregateInput = {
    linesOfCode?: SortOrder
    totalLinesWritten?: SortOrder
    clickMultiplier?: SortOrder
    passiveMultiplier?: SortOrder
    criticalChance?: SortOrder
    criticalMultiplier?: SortOrder
    level?: SortOrder
    experience?: SortOrder
    experienceToNext?: SortOrder
    prestigeLevel?: SortOrder
    prestigePoints?: SortOrder
    totalClicks?: SortOrder
    totalPlaytimeSeconds?: SortOrder
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
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

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type EnumItemCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.ItemCategory | EnumItemCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.ItemCategory[] | ListEnumItemCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.ItemCategory[] | ListEnumItemCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumItemCategoryFilter<$PrismaModel> | $Enums.ItemCategory
  }

  export type EnumEffectTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.EffectType | EnumEffectTypeFieldRefInput<$PrismaModel>
    in?: $Enums.EffectType[] | ListEnumEffectTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.EffectType[] | ListEnumEffectTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumEffectTypeFilter<$PrismaModel> | $Enums.EffectType
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

  export type EnumRarityFilter<$PrismaModel = never> = {
    equals?: $Enums.Rarity | EnumRarityFieldRefInput<$PrismaModel>
    in?: $Enums.Rarity[] | ListEnumRarityFieldRefInput<$PrismaModel>
    notIn?: $Enums.Rarity[] | ListEnumRarityFieldRefInput<$PrismaModel>
    not?: NestedEnumRarityFilter<$PrismaModel> | $Enums.Rarity
  }

  export type ItemCountOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    baseCost?: SortOrder
    baseEffect?: SortOrder
    effectType?: SortOrder
    costMultiplier?: SortOrder
    maxQuantity?: SortOrder
    unlockLevel?: SortOrder
    unlockItemSlug?: SortOrder
    iconUrl?: SortOrder
    rarity?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ItemAvgOrderByAggregateInput = {
    baseCost?: SortOrder
    baseEffect?: SortOrder
    costMultiplier?: SortOrder
    maxQuantity?: SortOrder
    unlockLevel?: SortOrder
  }

  export type ItemMaxOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    baseCost?: SortOrder
    baseEffect?: SortOrder
    effectType?: SortOrder
    costMultiplier?: SortOrder
    maxQuantity?: SortOrder
    unlockLevel?: SortOrder
    unlockItemSlug?: SortOrder
    iconUrl?: SortOrder
    rarity?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ItemMinOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    baseCost?: SortOrder
    baseEffect?: SortOrder
    effectType?: SortOrder
    costMultiplier?: SortOrder
    maxQuantity?: SortOrder
    unlockLevel?: SortOrder
    unlockItemSlug?: SortOrder
    iconUrl?: SortOrder
    rarity?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ItemSumOrderByAggregateInput = {
    baseCost?: SortOrder
    baseEffect?: SortOrder
    costMultiplier?: SortOrder
    maxQuantity?: SortOrder
    unlockLevel?: SortOrder
  }

  export type EnumItemCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ItemCategory | EnumItemCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.ItemCategory[] | ListEnumItemCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.ItemCategory[] | ListEnumItemCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumItemCategoryWithAggregatesFilter<$PrismaModel> | $Enums.ItemCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumItemCategoryFilter<$PrismaModel>
    _max?: NestedEnumItemCategoryFilter<$PrismaModel>
  }

  export type EnumEffectTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EffectType | EnumEffectTypeFieldRefInput<$PrismaModel>
    in?: $Enums.EffectType[] | ListEnumEffectTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.EffectType[] | ListEnumEffectTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumEffectTypeWithAggregatesFilter<$PrismaModel> | $Enums.EffectType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEffectTypeFilter<$PrismaModel>
    _max?: NestedEnumEffectTypeFilter<$PrismaModel>
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

  export type EnumRarityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Rarity | EnumRarityFieldRefInput<$PrismaModel>
    in?: $Enums.Rarity[] | ListEnumRarityFieldRefInput<$PrismaModel>
    notIn?: $Enums.Rarity[] | ListEnumRarityFieldRefInput<$PrismaModel>
    not?: NestedEnumRarityWithAggregatesFilter<$PrismaModel> | $Enums.Rarity
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRarityFilter<$PrismaModel>
    _max?: NestedEnumRarityFilter<$PrismaModel>
  }

  export type ItemRelationFilter = {
    is?: ItemWhereInput
    isNot?: ItemWhereInput
  }

  export type OwnedItemUserIdItemIdCompoundUniqueInput = {
    userId: string
    itemId: string
  }

  export type OwnedItemCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    itemId?: SortOrder
    quantity?: SortOrder
    level?: SortOrder
    purchasedAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OwnedItemAvgOrderByAggregateInput = {
    quantity?: SortOrder
    level?: SortOrder
  }

  export type OwnedItemMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    itemId?: SortOrder
    quantity?: SortOrder
    level?: SortOrder
    purchasedAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OwnedItemMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    itemId?: SortOrder
    quantity?: SortOrder
    level?: SortOrder
    purchasedAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OwnedItemSumOrderByAggregateInput = {
    quantity?: SortOrder
    level?: SortOrder
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

  export type EnumProgramCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.ProgramCategory | EnumProgramCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.ProgramCategory[] | ListEnumProgramCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProgramCategory[] | ListEnumProgramCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumProgramCategoryFilter<$PrismaModel> | $Enums.ProgramCategory
  }

  export type ProgramTypeCountOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    description?: SortOrder
    baseDurationSecs?: SortOrder
    baseReward?: SortOrder
    experienceReward?: SortOrder
    rewardMultiplier?: SortOrder
    unlockLevel?: SortOrder
    lootTable?: SortOrder
    iconUrl?: SortOrder
    category?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProgramTypeAvgOrderByAggregateInput = {
    baseDurationSecs?: SortOrder
    baseReward?: SortOrder
    experienceReward?: SortOrder
    rewardMultiplier?: SortOrder
    unlockLevel?: SortOrder
  }

  export type ProgramTypeMaxOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    description?: SortOrder
    baseDurationSecs?: SortOrder
    baseReward?: SortOrder
    experienceReward?: SortOrder
    rewardMultiplier?: SortOrder
    unlockLevel?: SortOrder
    iconUrl?: SortOrder
    category?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProgramTypeMinOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    description?: SortOrder
    baseDurationSecs?: SortOrder
    baseReward?: SortOrder
    experienceReward?: SortOrder
    rewardMultiplier?: SortOrder
    unlockLevel?: SortOrder
    iconUrl?: SortOrder
    category?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProgramTypeSumOrderByAggregateInput = {
    baseDurationSecs?: SortOrder
    baseReward?: SortOrder
    experienceReward?: SortOrder
    rewardMultiplier?: SortOrder
    unlockLevel?: SortOrder
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

  export type EnumProgramCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProgramCategory | EnumProgramCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.ProgramCategory[] | ListEnumProgramCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProgramCategory[] | ListEnumProgramCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumProgramCategoryWithAggregatesFilter<$PrismaModel> | $Enums.ProgramCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProgramCategoryFilter<$PrismaModel>
    _max?: NestedEnumProgramCategoryFilter<$PrismaModel>
  }

  export type EnumProgramStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ProgramStatus | EnumProgramStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProgramStatus[] | ListEnumProgramStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProgramStatus[] | ListEnumProgramStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProgramStatusFilter<$PrismaModel> | $Enums.ProgramStatus
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type ProgramTypeRelationFilter = {
    is?: ProgramTypeWhereInput
    isNot?: ProgramTypeWhereInput
  }

  export type ActiveProgramCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    programTypeId?: SortOrder
    startedAt?: SortOrder
    estimatedEndAt?: SortOrder
    completedAt?: SortOrder
    status?: SortOrder
    bullJobId?: SortOrder
    earnedReward?: SortOrder
    earnedExp?: SortOrder
    lootItems?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ActiveProgramAvgOrderByAggregateInput = {
    earnedReward?: SortOrder
    earnedExp?: SortOrder
  }

  export type ActiveProgramMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    programTypeId?: SortOrder
    startedAt?: SortOrder
    estimatedEndAt?: SortOrder
    completedAt?: SortOrder
    status?: SortOrder
    bullJobId?: SortOrder
    earnedReward?: SortOrder
    earnedExp?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ActiveProgramMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    programTypeId?: SortOrder
    startedAt?: SortOrder
    estimatedEndAt?: SortOrder
    completedAt?: SortOrder
    status?: SortOrder
    bullJobId?: SortOrder
    earnedReward?: SortOrder
    earnedExp?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ActiveProgramSumOrderByAggregateInput = {
    earnedReward?: SortOrder
    earnedExp?: SortOrder
  }

  export type EnumProgramStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProgramStatus | EnumProgramStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProgramStatus[] | ListEnumProgramStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProgramStatus[] | ListEnumProgramStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProgramStatusWithAggregatesFilter<$PrismaModel> | $Enums.ProgramStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProgramStatusFilter<$PrismaModel>
    _max?: NestedEnumProgramStatusFilter<$PrismaModel>
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type EnumTransactionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionStatus | EnumTransactionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionStatusFilter<$PrismaModel> | $Enums.TransactionStatus
  }

  export type EnumProductTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ProductType | EnumProductTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ProductType[] | ListEnumProductTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProductType[] | ListEnumProductTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumProductTypeFilter<$PrismaModel> | $Enums.ProductType
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type TransactionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    stripePaymentId?: SortOrder
    stripeCustomerId?: SortOrder
    amountCents?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    processedAt?: SortOrder
    idempotencyKey?: SortOrder
    productType?: SortOrder
    productData?: SortOrder
    fulfilled?: SortOrder
    fulfilledAt?: SortOrder
    fulfillmentJobId?: SortOrder
    lastError?: SortOrder
    retryCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TransactionAvgOrderByAggregateInput = {
    amountCents?: SortOrder
    retryCount?: SortOrder
  }

  export type TransactionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    stripePaymentId?: SortOrder
    stripeCustomerId?: SortOrder
    amountCents?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    processedAt?: SortOrder
    idempotencyKey?: SortOrder
    productType?: SortOrder
    fulfilled?: SortOrder
    fulfilledAt?: SortOrder
    fulfillmentJobId?: SortOrder
    lastError?: SortOrder
    retryCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TransactionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    stripePaymentId?: SortOrder
    stripeCustomerId?: SortOrder
    amountCents?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    processedAt?: SortOrder
    idempotencyKey?: SortOrder
    productType?: SortOrder
    fulfilled?: SortOrder
    fulfilledAt?: SortOrder
    fulfillmentJobId?: SortOrder
    lastError?: SortOrder
    retryCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TransactionSumOrderByAggregateInput = {
    amountCents?: SortOrder
    retryCount?: SortOrder
  }

  export type EnumTransactionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionStatus | EnumTransactionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionStatusWithAggregatesFilter<$PrismaModel> | $Enums.TransactionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTransactionStatusFilter<$PrismaModel>
    _max?: NestedEnumTransactionStatusFilter<$PrismaModel>
  }

  export type EnumProductTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProductType | EnumProductTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ProductType[] | ListEnumProductTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProductType[] | ListEnumProductTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumProductTypeWithAggregatesFilter<$PrismaModel> | $Enums.ProductType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProductTypeFilter<$PrismaModel>
    _max?: NestedEnumProductTypeFilter<$PrismaModel>
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

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumAchievementConditionFilter<$PrismaModel = never> = {
    equals?: $Enums.AchievementCondition | EnumAchievementConditionFieldRefInput<$PrismaModel>
    in?: $Enums.AchievementCondition[] | ListEnumAchievementConditionFieldRefInput<$PrismaModel>
    notIn?: $Enums.AchievementCondition[] | ListEnumAchievementConditionFieldRefInput<$PrismaModel>
    not?: NestedEnumAchievementConditionFilter<$PrismaModel> | $Enums.AchievementCondition
  }

  export type AchievementCountOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    description?: SortOrder
    conditionType?: SortOrder
    conditionValue?: SortOrder
    rewardLoC?: SortOrder
    rewardExp?: SortOrder
    rewardItemSlug?: SortOrder
    iconUrl?: SortOrder
    points?: SortOrder
    hidden?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AchievementAvgOrderByAggregateInput = {
    conditionValue?: SortOrder
    rewardLoC?: SortOrder
    rewardExp?: SortOrder
    points?: SortOrder
  }

  export type AchievementMaxOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    description?: SortOrder
    conditionType?: SortOrder
    conditionValue?: SortOrder
    rewardLoC?: SortOrder
    rewardExp?: SortOrder
    rewardItemSlug?: SortOrder
    iconUrl?: SortOrder
    points?: SortOrder
    hidden?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AchievementMinOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    description?: SortOrder
    conditionType?: SortOrder
    conditionValue?: SortOrder
    rewardLoC?: SortOrder
    rewardExp?: SortOrder
    rewardItemSlug?: SortOrder
    iconUrl?: SortOrder
    points?: SortOrder
    hidden?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AchievementSumOrderByAggregateInput = {
    conditionValue?: SortOrder
    rewardLoC?: SortOrder
    rewardExp?: SortOrder
    points?: SortOrder
  }

  export type EnumAchievementConditionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AchievementCondition | EnumAchievementConditionFieldRefInput<$PrismaModel>
    in?: $Enums.AchievementCondition[] | ListEnumAchievementConditionFieldRefInput<$PrismaModel>
    notIn?: $Enums.AchievementCondition[] | ListEnumAchievementConditionFieldRefInput<$PrismaModel>
    not?: NestedEnumAchievementConditionWithAggregatesFilter<$PrismaModel> | $Enums.AchievementCondition
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAchievementConditionFilter<$PrismaModel>
    _max?: NestedEnumAchievementConditionFilter<$PrismaModel>
  }

  export type AchievementRelationFilter = {
    is?: AchievementWhereInput
    isNot?: AchievementWhereInput
  }

  export type UserAchievementUserIdAchievementIdCompoundUniqueInput = {
    userId: string
    achievementId: string
  }

  export type UserAchievementCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    achievementId?: SortOrder
    unlockedAt?: SortOrder
    claimed?: SortOrder
    claimedAt?: SortOrder
  }

  export type UserAchievementMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    achievementId?: SortOrder
    unlockedAt?: SortOrder
    claimed?: SortOrder
    claimedAt?: SortOrder
  }

  export type UserAchievementMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    achievementId?: SortOrder
    unlockedAt?: SortOrder
    claimed?: SortOrder
    claimedAt?: SortOrder
  }

  export type OfflineSessionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    disconnectedAt?: SortOrder
    reconnectedAt?: SortOrder
    earnedLoC?: SortOrder
    earnedExp?: SortOrder
    processed?: SortOrder
    createdAt?: SortOrder
  }

  export type OfflineSessionAvgOrderByAggregateInput = {
    earnedLoC?: SortOrder
    earnedExp?: SortOrder
  }

  export type OfflineSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    disconnectedAt?: SortOrder
    reconnectedAt?: SortOrder
    earnedLoC?: SortOrder
    earnedExp?: SortOrder
    processed?: SortOrder
    createdAt?: SortOrder
  }

  export type OfflineSessionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    disconnectedAt?: SortOrder
    reconnectedAt?: SortOrder
    earnedLoC?: SortOrder
    earnedExp?: SortOrder
    processed?: SortOrder
    createdAt?: SortOrder
  }

  export type OfflineSessionSumOrderByAggregateInput = {
    earnedLoC?: SortOrder
    earnedExp?: SortOrder
  }

  export type ProgressionCreateNestedOneWithoutUserInput = {
    create?: XOR<ProgressionCreateWithoutUserInput, ProgressionUncheckedCreateWithoutUserInput>
    connectOrCreate?: ProgressionCreateOrConnectWithoutUserInput
    connect?: ProgressionWhereUniqueInput
  }

  export type OwnedItemCreateNestedManyWithoutUserInput = {
    create?: XOR<OwnedItemCreateWithoutUserInput, OwnedItemUncheckedCreateWithoutUserInput> | OwnedItemCreateWithoutUserInput[] | OwnedItemUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OwnedItemCreateOrConnectWithoutUserInput | OwnedItemCreateOrConnectWithoutUserInput[]
    createMany?: OwnedItemCreateManyUserInputEnvelope
    connect?: OwnedItemWhereUniqueInput | OwnedItemWhereUniqueInput[]
  }

  export type ActiveProgramCreateNestedManyWithoutUserInput = {
    create?: XOR<ActiveProgramCreateWithoutUserInput, ActiveProgramUncheckedCreateWithoutUserInput> | ActiveProgramCreateWithoutUserInput[] | ActiveProgramUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ActiveProgramCreateOrConnectWithoutUserInput | ActiveProgramCreateOrConnectWithoutUserInput[]
    createMany?: ActiveProgramCreateManyUserInputEnvelope
    connect?: ActiveProgramWhereUniqueInput | ActiveProgramWhereUniqueInput[]
  }

  export type TransactionCreateNestedManyWithoutUserInput = {
    create?: XOR<TransactionCreateWithoutUserInput, TransactionUncheckedCreateWithoutUserInput> | TransactionCreateWithoutUserInput[] | TransactionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutUserInput | TransactionCreateOrConnectWithoutUserInput[]
    createMany?: TransactionCreateManyUserInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type UserAchievementCreateNestedManyWithoutUserInput = {
    create?: XOR<UserAchievementCreateWithoutUserInput, UserAchievementUncheckedCreateWithoutUserInput> | UserAchievementCreateWithoutUserInput[] | UserAchievementUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserAchievementCreateOrConnectWithoutUserInput | UserAchievementCreateOrConnectWithoutUserInput[]
    createMany?: UserAchievementCreateManyUserInputEnvelope
    connect?: UserAchievementWhereUniqueInput | UserAchievementWhereUniqueInput[]
  }

  export type ProgressionUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<ProgressionCreateWithoutUserInput, ProgressionUncheckedCreateWithoutUserInput>
    connectOrCreate?: ProgressionCreateOrConnectWithoutUserInput
    connect?: ProgressionWhereUniqueInput
  }

  export type OwnedItemUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<OwnedItemCreateWithoutUserInput, OwnedItemUncheckedCreateWithoutUserInput> | OwnedItemCreateWithoutUserInput[] | OwnedItemUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OwnedItemCreateOrConnectWithoutUserInput | OwnedItemCreateOrConnectWithoutUserInput[]
    createMany?: OwnedItemCreateManyUserInputEnvelope
    connect?: OwnedItemWhereUniqueInput | OwnedItemWhereUniqueInput[]
  }

  export type ActiveProgramUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ActiveProgramCreateWithoutUserInput, ActiveProgramUncheckedCreateWithoutUserInput> | ActiveProgramCreateWithoutUserInput[] | ActiveProgramUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ActiveProgramCreateOrConnectWithoutUserInput | ActiveProgramCreateOrConnectWithoutUserInput[]
    createMany?: ActiveProgramCreateManyUserInputEnvelope
    connect?: ActiveProgramWhereUniqueInput | ActiveProgramWhereUniqueInput[]
  }

  export type TransactionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<TransactionCreateWithoutUserInput, TransactionUncheckedCreateWithoutUserInput> | TransactionCreateWithoutUserInput[] | TransactionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutUserInput | TransactionCreateOrConnectWithoutUserInput[]
    createMany?: TransactionCreateManyUserInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type UserAchievementUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UserAchievementCreateWithoutUserInput, UserAchievementUncheckedCreateWithoutUserInput> | UserAchievementCreateWithoutUserInput[] | UserAchievementUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserAchievementCreateOrConnectWithoutUserInput | UserAchievementCreateOrConnectWithoutUserInput[]
    createMany?: UserAchievementCreateManyUserInputEnvelope
    connect?: UserAchievementWhereUniqueInput | UserAchievementWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type ProgressionUpdateOneWithoutUserNestedInput = {
    create?: XOR<ProgressionCreateWithoutUserInput, ProgressionUncheckedCreateWithoutUserInput>
    connectOrCreate?: ProgressionCreateOrConnectWithoutUserInput
    upsert?: ProgressionUpsertWithoutUserInput
    disconnect?: ProgressionWhereInput | boolean
    delete?: ProgressionWhereInput | boolean
    connect?: ProgressionWhereUniqueInput
    update?: XOR<XOR<ProgressionUpdateToOneWithWhereWithoutUserInput, ProgressionUpdateWithoutUserInput>, ProgressionUncheckedUpdateWithoutUserInput>
  }

  export type OwnedItemUpdateManyWithoutUserNestedInput = {
    create?: XOR<OwnedItemCreateWithoutUserInput, OwnedItemUncheckedCreateWithoutUserInput> | OwnedItemCreateWithoutUserInput[] | OwnedItemUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OwnedItemCreateOrConnectWithoutUserInput | OwnedItemCreateOrConnectWithoutUserInput[]
    upsert?: OwnedItemUpsertWithWhereUniqueWithoutUserInput | OwnedItemUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: OwnedItemCreateManyUserInputEnvelope
    set?: OwnedItemWhereUniqueInput | OwnedItemWhereUniqueInput[]
    disconnect?: OwnedItemWhereUniqueInput | OwnedItemWhereUniqueInput[]
    delete?: OwnedItemWhereUniqueInput | OwnedItemWhereUniqueInput[]
    connect?: OwnedItemWhereUniqueInput | OwnedItemWhereUniqueInput[]
    update?: OwnedItemUpdateWithWhereUniqueWithoutUserInput | OwnedItemUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: OwnedItemUpdateManyWithWhereWithoutUserInput | OwnedItemUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: OwnedItemScalarWhereInput | OwnedItemScalarWhereInput[]
  }

  export type ActiveProgramUpdateManyWithoutUserNestedInput = {
    create?: XOR<ActiveProgramCreateWithoutUserInput, ActiveProgramUncheckedCreateWithoutUserInput> | ActiveProgramCreateWithoutUserInput[] | ActiveProgramUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ActiveProgramCreateOrConnectWithoutUserInput | ActiveProgramCreateOrConnectWithoutUserInput[]
    upsert?: ActiveProgramUpsertWithWhereUniqueWithoutUserInput | ActiveProgramUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ActiveProgramCreateManyUserInputEnvelope
    set?: ActiveProgramWhereUniqueInput | ActiveProgramWhereUniqueInput[]
    disconnect?: ActiveProgramWhereUniqueInput | ActiveProgramWhereUniqueInput[]
    delete?: ActiveProgramWhereUniqueInput | ActiveProgramWhereUniqueInput[]
    connect?: ActiveProgramWhereUniqueInput | ActiveProgramWhereUniqueInput[]
    update?: ActiveProgramUpdateWithWhereUniqueWithoutUserInput | ActiveProgramUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ActiveProgramUpdateManyWithWhereWithoutUserInput | ActiveProgramUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ActiveProgramScalarWhereInput | ActiveProgramScalarWhereInput[]
  }

  export type TransactionUpdateManyWithoutUserNestedInput = {
    create?: XOR<TransactionCreateWithoutUserInput, TransactionUncheckedCreateWithoutUserInput> | TransactionCreateWithoutUserInput[] | TransactionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutUserInput | TransactionCreateOrConnectWithoutUserInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutUserInput | TransactionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TransactionCreateManyUserInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutUserInput | TransactionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutUserInput | TransactionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type UserAchievementUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserAchievementCreateWithoutUserInput, UserAchievementUncheckedCreateWithoutUserInput> | UserAchievementCreateWithoutUserInput[] | UserAchievementUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserAchievementCreateOrConnectWithoutUserInput | UserAchievementCreateOrConnectWithoutUserInput[]
    upsert?: UserAchievementUpsertWithWhereUniqueWithoutUserInput | UserAchievementUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserAchievementCreateManyUserInputEnvelope
    set?: UserAchievementWhereUniqueInput | UserAchievementWhereUniqueInput[]
    disconnect?: UserAchievementWhereUniqueInput | UserAchievementWhereUniqueInput[]
    delete?: UserAchievementWhereUniqueInput | UserAchievementWhereUniqueInput[]
    connect?: UserAchievementWhereUniqueInput | UserAchievementWhereUniqueInput[]
    update?: UserAchievementUpdateWithWhereUniqueWithoutUserInput | UserAchievementUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserAchievementUpdateManyWithWhereWithoutUserInput | UserAchievementUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserAchievementScalarWhereInput | UserAchievementScalarWhereInput[]
  }

  export type ProgressionUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<ProgressionCreateWithoutUserInput, ProgressionUncheckedCreateWithoutUserInput>
    connectOrCreate?: ProgressionCreateOrConnectWithoutUserInput
    upsert?: ProgressionUpsertWithoutUserInput
    disconnect?: ProgressionWhereInput | boolean
    delete?: ProgressionWhereInput | boolean
    connect?: ProgressionWhereUniqueInput
    update?: XOR<XOR<ProgressionUpdateToOneWithWhereWithoutUserInput, ProgressionUpdateWithoutUserInput>, ProgressionUncheckedUpdateWithoutUserInput>
  }

  export type OwnedItemUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<OwnedItemCreateWithoutUserInput, OwnedItemUncheckedCreateWithoutUserInput> | OwnedItemCreateWithoutUserInput[] | OwnedItemUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OwnedItemCreateOrConnectWithoutUserInput | OwnedItemCreateOrConnectWithoutUserInput[]
    upsert?: OwnedItemUpsertWithWhereUniqueWithoutUserInput | OwnedItemUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: OwnedItemCreateManyUserInputEnvelope
    set?: OwnedItemWhereUniqueInput | OwnedItemWhereUniqueInput[]
    disconnect?: OwnedItemWhereUniqueInput | OwnedItemWhereUniqueInput[]
    delete?: OwnedItemWhereUniqueInput | OwnedItemWhereUniqueInput[]
    connect?: OwnedItemWhereUniqueInput | OwnedItemWhereUniqueInput[]
    update?: OwnedItemUpdateWithWhereUniqueWithoutUserInput | OwnedItemUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: OwnedItemUpdateManyWithWhereWithoutUserInput | OwnedItemUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: OwnedItemScalarWhereInput | OwnedItemScalarWhereInput[]
  }

  export type ActiveProgramUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ActiveProgramCreateWithoutUserInput, ActiveProgramUncheckedCreateWithoutUserInput> | ActiveProgramCreateWithoutUserInput[] | ActiveProgramUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ActiveProgramCreateOrConnectWithoutUserInput | ActiveProgramCreateOrConnectWithoutUserInput[]
    upsert?: ActiveProgramUpsertWithWhereUniqueWithoutUserInput | ActiveProgramUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ActiveProgramCreateManyUserInputEnvelope
    set?: ActiveProgramWhereUniqueInput | ActiveProgramWhereUniqueInput[]
    disconnect?: ActiveProgramWhereUniqueInput | ActiveProgramWhereUniqueInput[]
    delete?: ActiveProgramWhereUniqueInput | ActiveProgramWhereUniqueInput[]
    connect?: ActiveProgramWhereUniqueInput | ActiveProgramWhereUniqueInput[]
    update?: ActiveProgramUpdateWithWhereUniqueWithoutUserInput | ActiveProgramUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ActiveProgramUpdateManyWithWhereWithoutUserInput | ActiveProgramUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ActiveProgramScalarWhereInput | ActiveProgramScalarWhereInput[]
  }

  export type TransactionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<TransactionCreateWithoutUserInput, TransactionUncheckedCreateWithoutUserInput> | TransactionCreateWithoutUserInput[] | TransactionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutUserInput | TransactionCreateOrConnectWithoutUserInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutUserInput | TransactionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TransactionCreateManyUserInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutUserInput | TransactionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutUserInput | TransactionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type UserAchievementUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserAchievementCreateWithoutUserInput, UserAchievementUncheckedCreateWithoutUserInput> | UserAchievementCreateWithoutUserInput[] | UserAchievementUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserAchievementCreateOrConnectWithoutUserInput | UserAchievementCreateOrConnectWithoutUserInput[]
    upsert?: UserAchievementUpsertWithWhereUniqueWithoutUserInput | UserAchievementUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserAchievementCreateManyUserInputEnvelope
    set?: UserAchievementWhereUniqueInput | UserAchievementWhereUniqueInput[]
    disconnect?: UserAchievementWhereUniqueInput | UserAchievementWhereUniqueInput[]
    delete?: UserAchievementWhereUniqueInput | UserAchievementWhereUniqueInput[]
    connect?: UserAchievementWhereUniqueInput | UserAchievementWhereUniqueInput[]
    update?: UserAchievementUpdateWithWhereUniqueWithoutUserInput | UserAchievementUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserAchievementUpdateManyWithWhereWithoutUserInput | UserAchievementUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserAchievementScalarWhereInput | UserAchievementScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutProgressionInput = {
    create?: XOR<UserCreateWithoutProgressionInput, UserUncheckedCreateWithoutProgressionInput>
    connectOrCreate?: UserCreateOrConnectWithoutProgressionInput
    connect?: UserWhereUniqueInput
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type UserUpdateOneRequiredWithoutProgressionNestedInput = {
    create?: XOR<UserCreateWithoutProgressionInput, UserUncheckedCreateWithoutProgressionInput>
    connectOrCreate?: UserCreateOrConnectWithoutProgressionInput
    upsert?: UserUpsertWithoutProgressionInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutProgressionInput, UserUpdateWithoutProgressionInput>, UserUncheckedUpdateWithoutProgressionInput>
  }

  export type OwnedItemCreateNestedManyWithoutItemInput = {
    create?: XOR<OwnedItemCreateWithoutItemInput, OwnedItemUncheckedCreateWithoutItemInput> | OwnedItemCreateWithoutItemInput[] | OwnedItemUncheckedCreateWithoutItemInput[]
    connectOrCreate?: OwnedItemCreateOrConnectWithoutItemInput | OwnedItemCreateOrConnectWithoutItemInput[]
    createMany?: OwnedItemCreateManyItemInputEnvelope
    connect?: OwnedItemWhereUniqueInput | OwnedItemWhereUniqueInput[]
  }

  export type OwnedItemUncheckedCreateNestedManyWithoutItemInput = {
    create?: XOR<OwnedItemCreateWithoutItemInput, OwnedItemUncheckedCreateWithoutItemInput> | OwnedItemCreateWithoutItemInput[] | OwnedItemUncheckedCreateWithoutItemInput[]
    connectOrCreate?: OwnedItemCreateOrConnectWithoutItemInput | OwnedItemCreateOrConnectWithoutItemInput[]
    createMany?: OwnedItemCreateManyItemInputEnvelope
    connect?: OwnedItemWhereUniqueInput | OwnedItemWhereUniqueInput[]
  }

  export type EnumItemCategoryFieldUpdateOperationsInput = {
    set?: $Enums.ItemCategory
  }

  export type EnumEffectTypeFieldUpdateOperationsInput = {
    set?: $Enums.EffectType
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumRarityFieldUpdateOperationsInput = {
    set?: $Enums.Rarity
  }

  export type OwnedItemUpdateManyWithoutItemNestedInput = {
    create?: XOR<OwnedItemCreateWithoutItemInput, OwnedItemUncheckedCreateWithoutItemInput> | OwnedItemCreateWithoutItemInput[] | OwnedItemUncheckedCreateWithoutItemInput[]
    connectOrCreate?: OwnedItemCreateOrConnectWithoutItemInput | OwnedItemCreateOrConnectWithoutItemInput[]
    upsert?: OwnedItemUpsertWithWhereUniqueWithoutItemInput | OwnedItemUpsertWithWhereUniqueWithoutItemInput[]
    createMany?: OwnedItemCreateManyItemInputEnvelope
    set?: OwnedItemWhereUniqueInput | OwnedItemWhereUniqueInput[]
    disconnect?: OwnedItemWhereUniqueInput | OwnedItemWhereUniqueInput[]
    delete?: OwnedItemWhereUniqueInput | OwnedItemWhereUniqueInput[]
    connect?: OwnedItemWhereUniqueInput | OwnedItemWhereUniqueInput[]
    update?: OwnedItemUpdateWithWhereUniqueWithoutItemInput | OwnedItemUpdateWithWhereUniqueWithoutItemInput[]
    updateMany?: OwnedItemUpdateManyWithWhereWithoutItemInput | OwnedItemUpdateManyWithWhereWithoutItemInput[]
    deleteMany?: OwnedItemScalarWhereInput | OwnedItemScalarWhereInput[]
  }

  export type OwnedItemUncheckedUpdateManyWithoutItemNestedInput = {
    create?: XOR<OwnedItemCreateWithoutItemInput, OwnedItemUncheckedCreateWithoutItemInput> | OwnedItemCreateWithoutItemInput[] | OwnedItemUncheckedCreateWithoutItemInput[]
    connectOrCreate?: OwnedItemCreateOrConnectWithoutItemInput | OwnedItemCreateOrConnectWithoutItemInput[]
    upsert?: OwnedItemUpsertWithWhereUniqueWithoutItemInput | OwnedItemUpsertWithWhereUniqueWithoutItemInput[]
    createMany?: OwnedItemCreateManyItemInputEnvelope
    set?: OwnedItemWhereUniqueInput | OwnedItemWhereUniqueInput[]
    disconnect?: OwnedItemWhereUniqueInput | OwnedItemWhereUniqueInput[]
    delete?: OwnedItemWhereUniqueInput | OwnedItemWhereUniqueInput[]
    connect?: OwnedItemWhereUniqueInput | OwnedItemWhereUniqueInput[]
    update?: OwnedItemUpdateWithWhereUniqueWithoutItemInput | OwnedItemUpdateWithWhereUniqueWithoutItemInput[]
    updateMany?: OwnedItemUpdateManyWithWhereWithoutItemInput | OwnedItemUpdateManyWithWhereWithoutItemInput[]
    deleteMany?: OwnedItemScalarWhereInput | OwnedItemScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutOwnedItemsInput = {
    create?: XOR<UserCreateWithoutOwnedItemsInput, UserUncheckedCreateWithoutOwnedItemsInput>
    connectOrCreate?: UserCreateOrConnectWithoutOwnedItemsInput
    connect?: UserWhereUniqueInput
  }

  export type ItemCreateNestedOneWithoutOwnedItemsInput = {
    create?: XOR<ItemCreateWithoutOwnedItemsInput, ItemUncheckedCreateWithoutOwnedItemsInput>
    connectOrCreate?: ItemCreateOrConnectWithoutOwnedItemsInput
    connect?: ItemWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutOwnedItemsNestedInput = {
    create?: XOR<UserCreateWithoutOwnedItemsInput, UserUncheckedCreateWithoutOwnedItemsInput>
    connectOrCreate?: UserCreateOrConnectWithoutOwnedItemsInput
    upsert?: UserUpsertWithoutOwnedItemsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutOwnedItemsInput, UserUpdateWithoutOwnedItemsInput>, UserUncheckedUpdateWithoutOwnedItemsInput>
  }

  export type ItemUpdateOneRequiredWithoutOwnedItemsNestedInput = {
    create?: XOR<ItemCreateWithoutOwnedItemsInput, ItemUncheckedCreateWithoutOwnedItemsInput>
    connectOrCreate?: ItemCreateOrConnectWithoutOwnedItemsInput
    upsert?: ItemUpsertWithoutOwnedItemsInput
    connect?: ItemWhereUniqueInput
    update?: XOR<XOR<ItemUpdateToOneWithWhereWithoutOwnedItemsInput, ItemUpdateWithoutOwnedItemsInput>, ItemUncheckedUpdateWithoutOwnedItemsInput>
  }

  export type ActiveProgramCreateNestedManyWithoutProgramTypeInput = {
    create?: XOR<ActiveProgramCreateWithoutProgramTypeInput, ActiveProgramUncheckedCreateWithoutProgramTypeInput> | ActiveProgramCreateWithoutProgramTypeInput[] | ActiveProgramUncheckedCreateWithoutProgramTypeInput[]
    connectOrCreate?: ActiveProgramCreateOrConnectWithoutProgramTypeInput | ActiveProgramCreateOrConnectWithoutProgramTypeInput[]
    createMany?: ActiveProgramCreateManyProgramTypeInputEnvelope
    connect?: ActiveProgramWhereUniqueInput | ActiveProgramWhereUniqueInput[]
  }

  export type ActiveProgramUncheckedCreateNestedManyWithoutProgramTypeInput = {
    create?: XOR<ActiveProgramCreateWithoutProgramTypeInput, ActiveProgramUncheckedCreateWithoutProgramTypeInput> | ActiveProgramCreateWithoutProgramTypeInput[] | ActiveProgramUncheckedCreateWithoutProgramTypeInput[]
    connectOrCreate?: ActiveProgramCreateOrConnectWithoutProgramTypeInput | ActiveProgramCreateOrConnectWithoutProgramTypeInput[]
    createMany?: ActiveProgramCreateManyProgramTypeInputEnvelope
    connect?: ActiveProgramWhereUniqueInput | ActiveProgramWhereUniqueInput[]
  }

  export type EnumProgramCategoryFieldUpdateOperationsInput = {
    set?: $Enums.ProgramCategory
  }

  export type ActiveProgramUpdateManyWithoutProgramTypeNestedInput = {
    create?: XOR<ActiveProgramCreateWithoutProgramTypeInput, ActiveProgramUncheckedCreateWithoutProgramTypeInput> | ActiveProgramCreateWithoutProgramTypeInput[] | ActiveProgramUncheckedCreateWithoutProgramTypeInput[]
    connectOrCreate?: ActiveProgramCreateOrConnectWithoutProgramTypeInput | ActiveProgramCreateOrConnectWithoutProgramTypeInput[]
    upsert?: ActiveProgramUpsertWithWhereUniqueWithoutProgramTypeInput | ActiveProgramUpsertWithWhereUniqueWithoutProgramTypeInput[]
    createMany?: ActiveProgramCreateManyProgramTypeInputEnvelope
    set?: ActiveProgramWhereUniqueInput | ActiveProgramWhereUniqueInput[]
    disconnect?: ActiveProgramWhereUniqueInput | ActiveProgramWhereUniqueInput[]
    delete?: ActiveProgramWhereUniqueInput | ActiveProgramWhereUniqueInput[]
    connect?: ActiveProgramWhereUniqueInput | ActiveProgramWhereUniqueInput[]
    update?: ActiveProgramUpdateWithWhereUniqueWithoutProgramTypeInput | ActiveProgramUpdateWithWhereUniqueWithoutProgramTypeInput[]
    updateMany?: ActiveProgramUpdateManyWithWhereWithoutProgramTypeInput | ActiveProgramUpdateManyWithWhereWithoutProgramTypeInput[]
    deleteMany?: ActiveProgramScalarWhereInput | ActiveProgramScalarWhereInput[]
  }

  export type ActiveProgramUncheckedUpdateManyWithoutProgramTypeNestedInput = {
    create?: XOR<ActiveProgramCreateWithoutProgramTypeInput, ActiveProgramUncheckedCreateWithoutProgramTypeInput> | ActiveProgramCreateWithoutProgramTypeInput[] | ActiveProgramUncheckedCreateWithoutProgramTypeInput[]
    connectOrCreate?: ActiveProgramCreateOrConnectWithoutProgramTypeInput | ActiveProgramCreateOrConnectWithoutProgramTypeInput[]
    upsert?: ActiveProgramUpsertWithWhereUniqueWithoutProgramTypeInput | ActiveProgramUpsertWithWhereUniqueWithoutProgramTypeInput[]
    createMany?: ActiveProgramCreateManyProgramTypeInputEnvelope
    set?: ActiveProgramWhereUniqueInput | ActiveProgramWhereUniqueInput[]
    disconnect?: ActiveProgramWhereUniqueInput | ActiveProgramWhereUniqueInput[]
    delete?: ActiveProgramWhereUniqueInput | ActiveProgramWhereUniqueInput[]
    connect?: ActiveProgramWhereUniqueInput | ActiveProgramWhereUniqueInput[]
    update?: ActiveProgramUpdateWithWhereUniqueWithoutProgramTypeInput | ActiveProgramUpdateWithWhereUniqueWithoutProgramTypeInput[]
    updateMany?: ActiveProgramUpdateManyWithWhereWithoutProgramTypeInput | ActiveProgramUpdateManyWithWhereWithoutProgramTypeInput[]
    deleteMany?: ActiveProgramScalarWhereInput | ActiveProgramScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutActiveProgramsInput = {
    create?: XOR<UserCreateWithoutActiveProgramsInput, UserUncheckedCreateWithoutActiveProgramsInput>
    connectOrCreate?: UserCreateOrConnectWithoutActiveProgramsInput
    connect?: UserWhereUniqueInput
  }

  export type ProgramTypeCreateNestedOneWithoutActiveProgramsInput = {
    create?: XOR<ProgramTypeCreateWithoutActiveProgramsInput, ProgramTypeUncheckedCreateWithoutActiveProgramsInput>
    connectOrCreate?: ProgramTypeCreateOrConnectWithoutActiveProgramsInput
    connect?: ProgramTypeWhereUniqueInput
  }

  export type EnumProgramStatusFieldUpdateOperationsInput = {
    set?: $Enums.ProgramStatus
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type UserUpdateOneRequiredWithoutActiveProgramsNestedInput = {
    create?: XOR<UserCreateWithoutActiveProgramsInput, UserUncheckedCreateWithoutActiveProgramsInput>
    connectOrCreate?: UserCreateOrConnectWithoutActiveProgramsInput
    upsert?: UserUpsertWithoutActiveProgramsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutActiveProgramsInput, UserUpdateWithoutActiveProgramsInput>, UserUncheckedUpdateWithoutActiveProgramsInput>
  }

  export type ProgramTypeUpdateOneRequiredWithoutActiveProgramsNestedInput = {
    create?: XOR<ProgramTypeCreateWithoutActiveProgramsInput, ProgramTypeUncheckedCreateWithoutActiveProgramsInput>
    connectOrCreate?: ProgramTypeCreateOrConnectWithoutActiveProgramsInput
    upsert?: ProgramTypeUpsertWithoutActiveProgramsInput
    connect?: ProgramTypeWhereUniqueInput
    update?: XOR<XOR<ProgramTypeUpdateToOneWithWhereWithoutActiveProgramsInput, ProgramTypeUpdateWithoutActiveProgramsInput>, ProgramTypeUncheckedUpdateWithoutActiveProgramsInput>
  }

  export type UserCreateNestedOneWithoutTransactionsInput = {
    create?: XOR<UserCreateWithoutTransactionsInput, UserUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTransactionsInput
    connect?: UserWhereUniqueInput
  }

  export type EnumTransactionStatusFieldUpdateOperationsInput = {
    set?: $Enums.TransactionStatus
  }

  export type EnumProductTypeFieldUpdateOperationsInput = {
    set?: $Enums.ProductType
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type UserUpdateOneRequiredWithoutTransactionsNestedInput = {
    create?: XOR<UserCreateWithoutTransactionsInput, UserUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTransactionsInput
    upsert?: UserUpsertWithoutTransactionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTransactionsInput, UserUpdateWithoutTransactionsInput>, UserUncheckedUpdateWithoutTransactionsInput>
  }

  export type UserAchievementCreateNestedManyWithoutAchievementInput = {
    create?: XOR<UserAchievementCreateWithoutAchievementInput, UserAchievementUncheckedCreateWithoutAchievementInput> | UserAchievementCreateWithoutAchievementInput[] | UserAchievementUncheckedCreateWithoutAchievementInput[]
    connectOrCreate?: UserAchievementCreateOrConnectWithoutAchievementInput | UserAchievementCreateOrConnectWithoutAchievementInput[]
    createMany?: UserAchievementCreateManyAchievementInputEnvelope
    connect?: UserAchievementWhereUniqueInput | UserAchievementWhereUniqueInput[]
  }

  export type UserAchievementUncheckedCreateNestedManyWithoutAchievementInput = {
    create?: XOR<UserAchievementCreateWithoutAchievementInput, UserAchievementUncheckedCreateWithoutAchievementInput> | UserAchievementCreateWithoutAchievementInput[] | UserAchievementUncheckedCreateWithoutAchievementInput[]
    connectOrCreate?: UserAchievementCreateOrConnectWithoutAchievementInput | UserAchievementCreateOrConnectWithoutAchievementInput[]
    createMany?: UserAchievementCreateManyAchievementInputEnvelope
    connect?: UserAchievementWhereUniqueInput | UserAchievementWhereUniqueInput[]
  }

  export type EnumAchievementConditionFieldUpdateOperationsInput = {
    set?: $Enums.AchievementCondition
  }

  export type UserAchievementUpdateManyWithoutAchievementNestedInput = {
    create?: XOR<UserAchievementCreateWithoutAchievementInput, UserAchievementUncheckedCreateWithoutAchievementInput> | UserAchievementCreateWithoutAchievementInput[] | UserAchievementUncheckedCreateWithoutAchievementInput[]
    connectOrCreate?: UserAchievementCreateOrConnectWithoutAchievementInput | UserAchievementCreateOrConnectWithoutAchievementInput[]
    upsert?: UserAchievementUpsertWithWhereUniqueWithoutAchievementInput | UserAchievementUpsertWithWhereUniqueWithoutAchievementInput[]
    createMany?: UserAchievementCreateManyAchievementInputEnvelope
    set?: UserAchievementWhereUniqueInput | UserAchievementWhereUniqueInput[]
    disconnect?: UserAchievementWhereUniqueInput | UserAchievementWhereUniqueInput[]
    delete?: UserAchievementWhereUniqueInput | UserAchievementWhereUniqueInput[]
    connect?: UserAchievementWhereUniqueInput | UserAchievementWhereUniqueInput[]
    update?: UserAchievementUpdateWithWhereUniqueWithoutAchievementInput | UserAchievementUpdateWithWhereUniqueWithoutAchievementInput[]
    updateMany?: UserAchievementUpdateManyWithWhereWithoutAchievementInput | UserAchievementUpdateManyWithWhereWithoutAchievementInput[]
    deleteMany?: UserAchievementScalarWhereInput | UserAchievementScalarWhereInput[]
  }

  export type UserAchievementUncheckedUpdateManyWithoutAchievementNestedInput = {
    create?: XOR<UserAchievementCreateWithoutAchievementInput, UserAchievementUncheckedCreateWithoutAchievementInput> | UserAchievementCreateWithoutAchievementInput[] | UserAchievementUncheckedCreateWithoutAchievementInput[]
    connectOrCreate?: UserAchievementCreateOrConnectWithoutAchievementInput | UserAchievementCreateOrConnectWithoutAchievementInput[]
    upsert?: UserAchievementUpsertWithWhereUniqueWithoutAchievementInput | UserAchievementUpsertWithWhereUniqueWithoutAchievementInput[]
    createMany?: UserAchievementCreateManyAchievementInputEnvelope
    set?: UserAchievementWhereUniqueInput | UserAchievementWhereUniqueInput[]
    disconnect?: UserAchievementWhereUniqueInput | UserAchievementWhereUniqueInput[]
    delete?: UserAchievementWhereUniqueInput | UserAchievementWhereUniqueInput[]
    connect?: UserAchievementWhereUniqueInput | UserAchievementWhereUniqueInput[]
    update?: UserAchievementUpdateWithWhereUniqueWithoutAchievementInput | UserAchievementUpdateWithWhereUniqueWithoutAchievementInput[]
    updateMany?: UserAchievementUpdateManyWithWhereWithoutAchievementInput | UserAchievementUpdateManyWithWhereWithoutAchievementInput[]
    deleteMany?: UserAchievementScalarWhereInput | UserAchievementScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutAchievementsInput = {
    create?: XOR<UserCreateWithoutAchievementsInput, UserUncheckedCreateWithoutAchievementsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAchievementsInput
    connect?: UserWhereUniqueInput
  }

  export type AchievementCreateNestedOneWithoutUserAchievementsInput = {
    create?: XOR<AchievementCreateWithoutUserAchievementsInput, AchievementUncheckedCreateWithoutUserAchievementsInput>
    connectOrCreate?: AchievementCreateOrConnectWithoutUserAchievementsInput
    connect?: AchievementWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutAchievementsNestedInput = {
    create?: XOR<UserCreateWithoutAchievementsInput, UserUncheckedCreateWithoutAchievementsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAchievementsInput
    upsert?: UserUpsertWithoutAchievementsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAchievementsInput, UserUpdateWithoutAchievementsInput>, UserUncheckedUpdateWithoutAchievementsInput>
  }

  export type AchievementUpdateOneRequiredWithoutUserAchievementsNestedInput = {
    create?: XOR<AchievementCreateWithoutUserAchievementsInput, AchievementUncheckedCreateWithoutUserAchievementsInput>
    connectOrCreate?: AchievementCreateOrConnectWithoutUserAchievementsInput
    upsert?: AchievementUpsertWithoutUserAchievementsInput
    connect?: AchievementWhereUniqueInput
    update?: XOR<XOR<AchievementUpdateToOneWithWhereWithoutUserAchievementsInput, AchievementUpdateWithoutUserAchievementsInput>, AchievementUncheckedUpdateWithoutUserAchievementsInput>
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

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
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

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
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

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedEnumItemCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.ItemCategory | EnumItemCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.ItemCategory[] | ListEnumItemCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.ItemCategory[] | ListEnumItemCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumItemCategoryFilter<$PrismaModel> | $Enums.ItemCategory
  }

  export type NestedEnumEffectTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.EffectType | EnumEffectTypeFieldRefInput<$PrismaModel>
    in?: $Enums.EffectType[] | ListEnumEffectTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.EffectType[] | ListEnumEffectTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumEffectTypeFilter<$PrismaModel> | $Enums.EffectType
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

  export type NestedEnumRarityFilter<$PrismaModel = never> = {
    equals?: $Enums.Rarity | EnumRarityFieldRefInput<$PrismaModel>
    in?: $Enums.Rarity[] | ListEnumRarityFieldRefInput<$PrismaModel>
    notIn?: $Enums.Rarity[] | ListEnumRarityFieldRefInput<$PrismaModel>
    not?: NestedEnumRarityFilter<$PrismaModel> | $Enums.Rarity
  }

  export type NestedEnumItemCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ItemCategory | EnumItemCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.ItemCategory[] | ListEnumItemCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.ItemCategory[] | ListEnumItemCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumItemCategoryWithAggregatesFilter<$PrismaModel> | $Enums.ItemCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumItemCategoryFilter<$PrismaModel>
    _max?: NestedEnumItemCategoryFilter<$PrismaModel>
  }

  export type NestedEnumEffectTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EffectType | EnumEffectTypeFieldRefInput<$PrismaModel>
    in?: $Enums.EffectType[] | ListEnumEffectTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.EffectType[] | ListEnumEffectTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumEffectTypeWithAggregatesFilter<$PrismaModel> | $Enums.EffectType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEffectTypeFilter<$PrismaModel>
    _max?: NestedEnumEffectTypeFilter<$PrismaModel>
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

  export type NestedEnumRarityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Rarity | EnumRarityFieldRefInput<$PrismaModel>
    in?: $Enums.Rarity[] | ListEnumRarityFieldRefInput<$PrismaModel>
    notIn?: $Enums.Rarity[] | ListEnumRarityFieldRefInput<$PrismaModel>
    not?: NestedEnumRarityWithAggregatesFilter<$PrismaModel> | $Enums.Rarity
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRarityFilter<$PrismaModel>
    _max?: NestedEnumRarityFilter<$PrismaModel>
  }

  export type NestedEnumProgramCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.ProgramCategory | EnumProgramCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.ProgramCategory[] | ListEnumProgramCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProgramCategory[] | ListEnumProgramCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumProgramCategoryFilter<$PrismaModel> | $Enums.ProgramCategory
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

  export type NestedEnumProgramCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProgramCategory | EnumProgramCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.ProgramCategory[] | ListEnumProgramCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProgramCategory[] | ListEnumProgramCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumProgramCategoryWithAggregatesFilter<$PrismaModel> | $Enums.ProgramCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProgramCategoryFilter<$PrismaModel>
    _max?: NestedEnumProgramCategoryFilter<$PrismaModel>
  }

  export type NestedEnumProgramStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ProgramStatus | EnumProgramStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProgramStatus[] | ListEnumProgramStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProgramStatus[] | ListEnumProgramStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProgramStatusFilter<$PrismaModel> | $Enums.ProgramStatus
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedEnumProgramStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProgramStatus | EnumProgramStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProgramStatus[] | ListEnumProgramStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProgramStatus[] | ListEnumProgramStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProgramStatusWithAggregatesFilter<$PrismaModel> | $Enums.ProgramStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProgramStatusFilter<$PrismaModel>
    _max?: NestedEnumProgramStatusFilter<$PrismaModel>
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type NestedEnumTransactionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionStatus | EnumTransactionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionStatusFilter<$PrismaModel> | $Enums.TransactionStatus
  }

  export type NestedEnumProductTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ProductType | EnumProductTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ProductType[] | ListEnumProductTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProductType[] | ListEnumProductTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumProductTypeFilter<$PrismaModel> | $Enums.ProductType
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumTransactionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionStatus | EnumTransactionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TransactionStatus[] | ListEnumTransactionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTransactionStatusWithAggregatesFilter<$PrismaModel> | $Enums.TransactionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTransactionStatusFilter<$PrismaModel>
    _max?: NestedEnumTransactionStatusFilter<$PrismaModel>
  }

  export type NestedEnumProductTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProductType | EnumProductTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ProductType[] | ListEnumProductTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProductType[] | ListEnumProductTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumProductTypeWithAggregatesFilter<$PrismaModel> | $Enums.ProductType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProductTypeFilter<$PrismaModel>
    _max?: NestedEnumProductTypeFilter<$PrismaModel>
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

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumAchievementConditionFilter<$PrismaModel = never> = {
    equals?: $Enums.AchievementCondition | EnumAchievementConditionFieldRefInput<$PrismaModel>
    in?: $Enums.AchievementCondition[] | ListEnumAchievementConditionFieldRefInput<$PrismaModel>
    notIn?: $Enums.AchievementCondition[] | ListEnumAchievementConditionFieldRefInput<$PrismaModel>
    not?: NestedEnumAchievementConditionFilter<$PrismaModel> | $Enums.AchievementCondition
  }

  export type NestedEnumAchievementConditionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AchievementCondition | EnumAchievementConditionFieldRefInput<$PrismaModel>
    in?: $Enums.AchievementCondition[] | ListEnumAchievementConditionFieldRefInput<$PrismaModel>
    notIn?: $Enums.AchievementCondition[] | ListEnumAchievementConditionFieldRefInput<$PrismaModel>
    not?: NestedEnumAchievementConditionWithAggregatesFilter<$PrismaModel> | $Enums.AchievementCondition
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAchievementConditionFilter<$PrismaModel>
    _max?: NestedEnumAchievementConditionFilter<$PrismaModel>
  }

  export type ProgressionCreateWithoutUserInput = {
    id?: string
    linesOfCode?: Decimal | DecimalJsLike | number | string
    totalLinesWritten?: Decimal | DecimalJsLike | number | string
    clickMultiplier?: number
    passiveMultiplier?: number
    criticalChance?: number
    criticalMultiplier?: number
    level?: number
    experience?: Decimal | DecimalJsLike | number | string
    experienceToNext?: Decimal | DecimalJsLike | number | string
    prestigeLevel?: number
    prestigePoints?: Decimal | DecimalJsLike | number | string
    totalClicks?: bigint | number
    totalPlaytimeSeconds?: bigint | number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProgressionUncheckedCreateWithoutUserInput = {
    id?: string
    linesOfCode?: Decimal | DecimalJsLike | number | string
    totalLinesWritten?: Decimal | DecimalJsLike | number | string
    clickMultiplier?: number
    passiveMultiplier?: number
    criticalChance?: number
    criticalMultiplier?: number
    level?: number
    experience?: Decimal | DecimalJsLike | number | string
    experienceToNext?: Decimal | DecimalJsLike | number | string
    prestigeLevel?: number
    prestigePoints?: Decimal | DecimalJsLike | number | string
    totalClicks?: bigint | number
    totalPlaytimeSeconds?: bigint | number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProgressionCreateOrConnectWithoutUserInput = {
    where: ProgressionWhereUniqueInput
    create: XOR<ProgressionCreateWithoutUserInput, ProgressionUncheckedCreateWithoutUserInput>
  }

  export type OwnedItemCreateWithoutUserInput = {
    id?: string
    quantity?: number
    level?: number
    purchasedAt?: Date | string
    updatedAt?: Date | string
    item: ItemCreateNestedOneWithoutOwnedItemsInput
  }

  export type OwnedItemUncheckedCreateWithoutUserInput = {
    id?: string
    itemId: string
    quantity?: number
    level?: number
    purchasedAt?: Date | string
    updatedAt?: Date | string
  }

  export type OwnedItemCreateOrConnectWithoutUserInput = {
    where: OwnedItemWhereUniqueInput
    create: XOR<OwnedItemCreateWithoutUserInput, OwnedItemUncheckedCreateWithoutUserInput>
  }

  export type OwnedItemCreateManyUserInputEnvelope = {
    data: OwnedItemCreateManyUserInput | OwnedItemCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ActiveProgramCreateWithoutUserInput = {
    id?: string
    startedAt?: Date | string
    estimatedEndAt: Date | string
    completedAt?: Date | string | null
    status?: $Enums.ProgramStatus
    bullJobId?: string | null
    earnedReward?: Decimal | DecimalJsLike | number | string | null
    earnedExp?: Decimal | DecimalJsLike | number | string | null
    lootItems?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    programType: ProgramTypeCreateNestedOneWithoutActiveProgramsInput
  }

  export type ActiveProgramUncheckedCreateWithoutUserInput = {
    id?: string
    programTypeId: string
    startedAt?: Date | string
    estimatedEndAt: Date | string
    completedAt?: Date | string | null
    status?: $Enums.ProgramStatus
    bullJobId?: string | null
    earnedReward?: Decimal | DecimalJsLike | number | string | null
    earnedExp?: Decimal | DecimalJsLike | number | string | null
    lootItems?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ActiveProgramCreateOrConnectWithoutUserInput = {
    where: ActiveProgramWhereUniqueInput
    create: XOR<ActiveProgramCreateWithoutUserInput, ActiveProgramUncheckedCreateWithoutUserInput>
  }

  export type ActiveProgramCreateManyUserInputEnvelope = {
    data: ActiveProgramCreateManyUserInput | ActiveProgramCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type TransactionCreateWithoutUserInput = {
    id?: string
    stripePaymentId: string
    stripeCustomerId?: string | null
    amountCents: number
    currency?: string
    status?: $Enums.TransactionStatus
    processedAt?: Date | string | null
    idempotencyKey: string
    productType: $Enums.ProductType
    productData: JsonNullValueInput | InputJsonValue
    fulfilled?: boolean
    fulfilledAt?: Date | string | null
    fulfillmentJobId?: string | null
    lastError?: string | null
    retryCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionUncheckedCreateWithoutUserInput = {
    id?: string
    stripePaymentId: string
    stripeCustomerId?: string | null
    amountCents: number
    currency?: string
    status?: $Enums.TransactionStatus
    processedAt?: Date | string | null
    idempotencyKey: string
    productType: $Enums.ProductType
    productData: JsonNullValueInput | InputJsonValue
    fulfilled?: boolean
    fulfilledAt?: Date | string | null
    fulfillmentJobId?: string | null
    lastError?: string | null
    retryCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionCreateOrConnectWithoutUserInput = {
    where: TransactionWhereUniqueInput
    create: XOR<TransactionCreateWithoutUserInput, TransactionUncheckedCreateWithoutUserInput>
  }

  export type TransactionCreateManyUserInputEnvelope = {
    data: TransactionCreateManyUserInput | TransactionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type UserAchievementCreateWithoutUserInput = {
    id?: string
    unlockedAt?: Date | string
    claimed?: boolean
    claimedAt?: Date | string | null
    achievement: AchievementCreateNestedOneWithoutUserAchievementsInput
  }

  export type UserAchievementUncheckedCreateWithoutUserInput = {
    id?: string
    achievementId: string
    unlockedAt?: Date | string
    claimed?: boolean
    claimedAt?: Date | string | null
  }

  export type UserAchievementCreateOrConnectWithoutUserInput = {
    where: UserAchievementWhereUniqueInput
    create: XOR<UserAchievementCreateWithoutUserInput, UserAchievementUncheckedCreateWithoutUserInput>
  }

  export type UserAchievementCreateManyUserInputEnvelope = {
    data: UserAchievementCreateManyUserInput | UserAchievementCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ProgressionUpsertWithoutUserInput = {
    update: XOR<ProgressionUpdateWithoutUserInput, ProgressionUncheckedUpdateWithoutUserInput>
    create: XOR<ProgressionCreateWithoutUserInput, ProgressionUncheckedCreateWithoutUserInput>
    where?: ProgressionWhereInput
  }

  export type ProgressionUpdateToOneWithWhereWithoutUserInput = {
    where?: ProgressionWhereInput
    data: XOR<ProgressionUpdateWithoutUserInput, ProgressionUncheckedUpdateWithoutUserInput>
  }

  export type ProgressionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    linesOfCode?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalLinesWritten?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    clickMultiplier?: FloatFieldUpdateOperationsInput | number
    passiveMultiplier?: FloatFieldUpdateOperationsInput | number
    criticalChance?: FloatFieldUpdateOperationsInput | number
    criticalMultiplier?: FloatFieldUpdateOperationsInput | number
    level?: IntFieldUpdateOperationsInput | number
    experience?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    experienceToNext?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    prestigeLevel?: IntFieldUpdateOperationsInput | number
    prestigePoints?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalClicks?: BigIntFieldUpdateOperationsInput | bigint | number
    totalPlaytimeSeconds?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProgressionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    linesOfCode?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalLinesWritten?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    clickMultiplier?: FloatFieldUpdateOperationsInput | number
    passiveMultiplier?: FloatFieldUpdateOperationsInput | number
    criticalChance?: FloatFieldUpdateOperationsInput | number
    criticalMultiplier?: FloatFieldUpdateOperationsInput | number
    level?: IntFieldUpdateOperationsInput | number
    experience?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    experienceToNext?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    prestigeLevel?: IntFieldUpdateOperationsInput | number
    prestigePoints?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalClicks?: BigIntFieldUpdateOperationsInput | bigint | number
    totalPlaytimeSeconds?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OwnedItemUpsertWithWhereUniqueWithoutUserInput = {
    where: OwnedItemWhereUniqueInput
    update: XOR<OwnedItemUpdateWithoutUserInput, OwnedItemUncheckedUpdateWithoutUserInput>
    create: XOR<OwnedItemCreateWithoutUserInput, OwnedItemUncheckedCreateWithoutUserInput>
  }

  export type OwnedItemUpdateWithWhereUniqueWithoutUserInput = {
    where: OwnedItemWhereUniqueInput
    data: XOR<OwnedItemUpdateWithoutUserInput, OwnedItemUncheckedUpdateWithoutUserInput>
  }

  export type OwnedItemUpdateManyWithWhereWithoutUserInput = {
    where: OwnedItemScalarWhereInput
    data: XOR<OwnedItemUpdateManyMutationInput, OwnedItemUncheckedUpdateManyWithoutUserInput>
  }

  export type OwnedItemScalarWhereInput = {
    AND?: OwnedItemScalarWhereInput | OwnedItemScalarWhereInput[]
    OR?: OwnedItemScalarWhereInput[]
    NOT?: OwnedItemScalarWhereInput | OwnedItemScalarWhereInput[]
    id?: StringFilter<"OwnedItem"> | string
    userId?: StringFilter<"OwnedItem"> | string
    itemId?: StringFilter<"OwnedItem"> | string
    quantity?: IntFilter<"OwnedItem"> | number
    level?: IntFilter<"OwnedItem"> | number
    purchasedAt?: DateTimeFilter<"OwnedItem"> | Date | string
    updatedAt?: DateTimeFilter<"OwnedItem"> | Date | string
  }

  export type ActiveProgramUpsertWithWhereUniqueWithoutUserInput = {
    where: ActiveProgramWhereUniqueInput
    update: XOR<ActiveProgramUpdateWithoutUserInput, ActiveProgramUncheckedUpdateWithoutUserInput>
    create: XOR<ActiveProgramCreateWithoutUserInput, ActiveProgramUncheckedCreateWithoutUserInput>
  }

  export type ActiveProgramUpdateWithWhereUniqueWithoutUserInput = {
    where: ActiveProgramWhereUniqueInput
    data: XOR<ActiveProgramUpdateWithoutUserInput, ActiveProgramUncheckedUpdateWithoutUserInput>
  }

  export type ActiveProgramUpdateManyWithWhereWithoutUserInput = {
    where: ActiveProgramScalarWhereInput
    data: XOR<ActiveProgramUpdateManyMutationInput, ActiveProgramUncheckedUpdateManyWithoutUserInput>
  }

  export type ActiveProgramScalarWhereInput = {
    AND?: ActiveProgramScalarWhereInput | ActiveProgramScalarWhereInput[]
    OR?: ActiveProgramScalarWhereInput[]
    NOT?: ActiveProgramScalarWhereInput | ActiveProgramScalarWhereInput[]
    id?: StringFilter<"ActiveProgram"> | string
    userId?: StringFilter<"ActiveProgram"> | string
    programTypeId?: StringFilter<"ActiveProgram"> | string
    startedAt?: DateTimeFilter<"ActiveProgram"> | Date | string
    estimatedEndAt?: DateTimeFilter<"ActiveProgram"> | Date | string
    completedAt?: DateTimeNullableFilter<"ActiveProgram"> | Date | string | null
    status?: EnumProgramStatusFilter<"ActiveProgram"> | $Enums.ProgramStatus
    bullJobId?: StringNullableFilter<"ActiveProgram"> | string | null
    earnedReward?: DecimalNullableFilter<"ActiveProgram"> | Decimal | DecimalJsLike | number | string | null
    earnedExp?: DecimalNullableFilter<"ActiveProgram"> | Decimal | DecimalJsLike | number | string | null
    lootItems?: JsonNullableFilter<"ActiveProgram">
    createdAt?: DateTimeFilter<"ActiveProgram"> | Date | string
    updatedAt?: DateTimeFilter<"ActiveProgram"> | Date | string
  }

  export type TransactionUpsertWithWhereUniqueWithoutUserInput = {
    where: TransactionWhereUniqueInput
    update: XOR<TransactionUpdateWithoutUserInput, TransactionUncheckedUpdateWithoutUserInput>
    create: XOR<TransactionCreateWithoutUserInput, TransactionUncheckedCreateWithoutUserInput>
  }

  export type TransactionUpdateWithWhereUniqueWithoutUserInput = {
    where: TransactionWhereUniqueInput
    data: XOR<TransactionUpdateWithoutUserInput, TransactionUncheckedUpdateWithoutUserInput>
  }

  export type TransactionUpdateManyWithWhereWithoutUserInput = {
    where: TransactionScalarWhereInput
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyWithoutUserInput>
  }

  export type TransactionScalarWhereInput = {
    AND?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
    OR?: TransactionScalarWhereInput[]
    NOT?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
    id?: StringFilter<"Transaction"> | string
    userId?: StringFilter<"Transaction"> | string
    stripePaymentId?: StringFilter<"Transaction"> | string
    stripeCustomerId?: StringNullableFilter<"Transaction"> | string | null
    amountCents?: IntFilter<"Transaction"> | number
    currency?: StringFilter<"Transaction"> | string
    status?: EnumTransactionStatusFilter<"Transaction"> | $Enums.TransactionStatus
    processedAt?: DateTimeNullableFilter<"Transaction"> | Date | string | null
    idempotencyKey?: StringFilter<"Transaction"> | string
    productType?: EnumProductTypeFilter<"Transaction"> | $Enums.ProductType
    productData?: JsonFilter<"Transaction">
    fulfilled?: BoolFilter<"Transaction"> | boolean
    fulfilledAt?: DateTimeNullableFilter<"Transaction"> | Date | string | null
    fulfillmentJobId?: StringNullableFilter<"Transaction"> | string | null
    lastError?: StringNullableFilter<"Transaction"> | string | null
    retryCount?: IntFilter<"Transaction"> | number
    createdAt?: DateTimeFilter<"Transaction"> | Date | string
    updatedAt?: DateTimeFilter<"Transaction"> | Date | string
  }

  export type UserAchievementUpsertWithWhereUniqueWithoutUserInput = {
    where: UserAchievementWhereUniqueInput
    update: XOR<UserAchievementUpdateWithoutUserInput, UserAchievementUncheckedUpdateWithoutUserInput>
    create: XOR<UserAchievementCreateWithoutUserInput, UserAchievementUncheckedCreateWithoutUserInput>
  }

  export type UserAchievementUpdateWithWhereUniqueWithoutUserInput = {
    where: UserAchievementWhereUniqueInput
    data: XOR<UserAchievementUpdateWithoutUserInput, UserAchievementUncheckedUpdateWithoutUserInput>
  }

  export type UserAchievementUpdateManyWithWhereWithoutUserInput = {
    where: UserAchievementScalarWhereInput
    data: XOR<UserAchievementUpdateManyMutationInput, UserAchievementUncheckedUpdateManyWithoutUserInput>
  }

  export type UserAchievementScalarWhereInput = {
    AND?: UserAchievementScalarWhereInput | UserAchievementScalarWhereInput[]
    OR?: UserAchievementScalarWhereInput[]
    NOT?: UserAchievementScalarWhereInput | UserAchievementScalarWhereInput[]
    id?: StringFilter<"UserAchievement"> | string
    userId?: StringFilter<"UserAchievement"> | string
    achievementId?: StringFilter<"UserAchievement"> | string
    unlockedAt?: DateTimeFilter<"UserAchievement"> | Date | string
    claimed?: BoolFilter<"UserAchievement"> | boolean
    claimedAt?: DateTimeNullableFilter<"UserAchievement"> | Date | string | null
  }

  export type UserCreateWithoutProgressionInput = {
    id?: string
    email: string
    username: string
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastLoginAt?: Date | string | null
    lastActiveAt?: Date | string | null
    ownedItems?: OwnedItemCreateNestedManyWithoutUserInput
    activePrograms?: ActiveProgramCreateNestedManyWithoutUserInput
    transactions?: TransactionCreateNestedManyWithoutUserInput
    achievements?: UserAchievementCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutProgressionInput = {
    id?: string
    email: string
    username: string
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastLoginAt?: Date | string | null
    lastActiveAt?: Date | string | null
    ownedItems?: OwnedItemUncheckedCreateNestedManyWithoutUserInput
    activePrograms?: ActiveProgramUncheckedCreateNestedManyWithoutUserInput
    transactions?: TransactionUncheckedCreateNestedManyWithoutUserInput
    achievements?: UserAchievementUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutProgressionInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutProgressionInput, UserUncheckedCreateWithoutProgressionInput>
  }

  export type UserUpsertWithoutProgressionInput = {
    update: XOR<UserUpdateWithoutProgressionInput, UserUncheckedUpdateWithoutProgressionInput>
    create: XOR<UserCreateWithoutProgressionInput, UserUncheckedCreateWithoutProgressionInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutProgressionInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutProgressionInput, UserUncheckedUpdateWithoutProgressionInput>
  }

  export type UserUpdateWithoutProgressionInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastActiveAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ownedItems?: OwnedItemUpdateManyWithoutUserNestedInput
    activePrograms?: ActiveProgramUpdateManyWithoutUserNestedInput
    transactions?: TransactionUpdateManyWithoutUserNestedInput
    achievements?: UserAchievementUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutProgressionInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastActiveAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ownedItems?: OwnedItemUncheckedUpdateManyWithoutUserNestedInput
    activePrograms?: ActiveProgramUncheckedUpdateManyWithoutUserNestedInput
    transactions?: TransactionUncheckedUpdateManyWithoutUserNestedInput
    achievements?: UserAchievementUncheckedUpdateManyWithoutUserNestedInput
  }

  export type OwnedItemCreateWithoutItemInput = {
    id?: string
    quantity?: number
    level?: number
    purchasedAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutOwnedItemsInput
  }

  export type OwnedItemUncheckedCreateWithoutItemInput = {
    id?: string
    userId: string
    quantity?: number
    level?: number
    purchasedAt?: Date | string
    updatedAt?: Date | string
  }

  export type OwnedItemCreateOrConnectWithoutItemInput = {
    where: OwnedItemWhereUniqueInput
    create: XOR<OwnedItemCreateWithoutItemInput, OwnedItemUncheckedCreateWithoutItemInput>
  }

  export type OwnedItemCreateManyItemInputEnvelope = {
    data: OwnedItemCreateManyItemInput | OwnedItemCreateManyItemInput[]
    skipDuplicates?: boolean
  }

  export type OwnedItemUpsertWithWhereUniqueWithoutItemInput = {
    where: OwnedItemWhereUniqueInput
    update: XOR<OwnedItemUpdateWithoutItemInput, OwnedItemUncheckedUpdateWithoutItemInput>
    create: XOR<OwnedItemCreateWithoutItemInput, OwnedItemUncheckedCreateWithoutItemInput>
  }

  export type OwnedItemUpdateWithWhereUniqueWithoutItemInput = {
    where: OwnedItemWhereUniqueInput
    data: XOR<OwnedItemUpdateWithoutItemInput, OwnedItemUncheckedUpdateWithoutItemInput>
  }

  export type OwnedItemUpdateManyWithWhereWithoutItemInput = {
    where: OwnedItemScalarWhereInput
    data: XOR<OwnedItemUpdateManyMutationInput, OwnedItemUncheckedUpdateManyWithoutItemInput>
  }

  export type UserCreateWithoutOwnedItemsInput = {
    id?: string
    email: string
    username: string
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastLoginAt?: Date | string | null
    lastActiveAt?: Date | string | null
    progression?: ProgressionCreateNestedOneWithoutUserInput
    activePrograms?: ActiveProgramCreateNestedManyWithoutUserInput
    transactions?: TransactionCreateNestedManyWithoutUserInput
    achievements?: UserAchievementCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutOwnedItemsInput = {
    id?: string
    email: string
    username: string
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastLoginAt?: Date | string | null
    lastActiveAt?: Date | string | null
    progression?: ProgressionUncheckedCreateNestedOneWithoutUserInput
    activePrograms?: ActiveProgramUncheckedCreateNestedManyWithoutUserInput
    transactions?: TransactionUncheckedCreateNestedManyWithoutUserInput
    achievements?: UserAchievementUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutOwnedItemsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutOwnedItemsInput, UserUncheckedCreateWithoutOwnedItemsInput>
  }

  export type ItemCreateWithoutOwnedItemsInput = {
    id?: string
    slug: string
    name: string
    description: string
    category: $Enums.ItemCategory
    baseCost: Decimal | DecimalJsLike | number | string
    baseEffect: number
    effectType: $Enums.EffectType
    costMultiplier?: number
    maxQuantity?: number | null
    unlockLevel?: number
    unlockItemSlug?: string | null
    iconUrl?: string | null
    rarity?: $Enums.Rarity
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ItemUncheckedCreateWithoutOwnedItemsInput = {
    id?: string
    slug: string
    name: string
    description: string
    category: $Enums.ItemCategory
    baseCost: Decimal | DecimalJsLike | number | string
    baseEffect: number
    effectType: $Enums.EffectType
    costMultiplier?: number
    maxQuantity?: number | null
    unlockLevel?: number
    unlockItemSlug?: string | null
    iconUrl?: string | null
    rarity?: $Enums.Rarity
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ItemCreateOrConnectWithoutOwnedItemsInput = {
    where: ItemWhereUniqueInput
    create: XOR<ItemCreateWithoutOwnedItemsInput, ItemUncheckedCreateWithoutOwnedItemsInput>
  }

  export type UserUpsertWithoutOwnedItemsInput = {
    update: XOR<UserUpdateWithoutOwnedItemsInput, UserUncheckedUpdateWithoutOwnedItemsInput>
    create: XOR<UserCreateWithoutOwnedItemsInput, UserUncheckedCreateWithoutOwnedItemsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutOwnedItemsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutOwnedItemsInput, UserUncheckedUpdateWithoutOwnedItemsInput>
  }

  export type UserUpdateWithoutOwnedItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastActiveAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    progression?: ProgressionUpdateOneWithoutUserNestedInput
    activePrograms?: ActiveProgramUpdateManyWithoutUserNestedInput
    transactions?: TransactionUpdateManyWithoutUserNestedInput
    achievements?: UserAchievementUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutOwnedItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastActiveAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    progression?: ProgressionUncheckedUpdateOneWithoutUserNestedInput
    activePrograms?: ActiveProgramUncheckedUpdateManyWithoutUserNestedInput
    transactions?: TransactionUncheckedUpdateManyWithoutUserNestedInput
    achievements?: UserAchievementUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ItemUpsertWithoutOwnedItemsInput = {
    update: XOR<ItemUpdateWithoutOwnedItemsInput, ItemUncheckedUpdateWithoutOwnedItemsInput>
    create: XOR<ItemCreateWithoutOwnedItemsInput, ItemUncheckedCreateWithoutOwnedItemsInput>
    where?: ItemWhereInput
  }

  export type ItemUpdateToOneWithWhereWithoutOwnedItemsInput = {
    where?: ItemWhereInput
    data: XOR<ItemUpdateWithoutOwnedItemsInput, ItemUncheckedUpdateWithoutOwnedItemsInput>
  }

  export type ItemUpdateWithoutOwnedItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: EnumItemCategoryFieldUpdateOperationsInput | $Enums.ItemCategory
    baseCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    baseEffect?: FloatFieldUpdateOperationsInput | number
    effectType?: EnumEffectTypeFieldUpdateOperationsInput | $Enums.EffectType
    costMultiplier?: FloatFieldUpdateOperationsInput | number
    maxQuantity?: NullableIntFieldUpdateOperationsInput | number | null
    unlockLevel?: IntFieldUpdateOperationsInput | number
    unlockItemSlug?: NullableStringFieldUpdateOperationsInput | string | null
    iconUrl?: NullableStringFieldUpdateOperationsInput | string | null
    rarity?: EnumRarityFieldUpdateOperationsInput | $Enums.Rarity
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemUncheckedUpdateWithoutOwnedItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: EnumItemCategoryFieldUpdateOperationsInput | $Enums.ItemCategory
    baseCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    baseEffect?: FloatFieldUpdateOperationsInput | number
    effectType?: EnumEffectTypeFieldUpdateOperationsInput | $Enums.EffectType
    costMultiplier?: FloatFieldUpdateOperationsInput | number
    maxQuantity?: NullableIntFieldUpdateOperationsInput | number | null
    unlockLevel?: IntFieldUpdateOperationsInput | number
    unlockItemSlug?: NullableStringFieldUpdateOperationsInput | string | null
    iconUrl?: NullableStringFieldUpdateOperationsInput | string | null
    rarity?: EnumRarityFieldUpdateOperationsInput | $Enums.Rarity
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActiveProgramCreateWithoutProgramTypeInput = {
    id?: string
    startedAt?: Date | string
    estimatedEndAt: Date | string
    completedAt?: Date | string | null
    status?: $Enums.ProgramStatus
    bullJobId?: string | null
    earnedReward?: Decimal | DecimalJsLike | number | string | null
    earnedExp?: Decimal | DecimalJsLike | number | string | null
    lootItems?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutActiveProgramsInput
  }

  export type ActiveProgramUncheckedCreateWithoutProgramTypeInput = {
    id?: string
    userId: string
    startedAt?: Date | string
    estimatedEndAt: Date | string
    completedAt?: Date | string | null
    status?: $Enums.ProgramStatus
    bullJobId?: string | null
    earnedReward?: Decimal | DecimalJsLike | number | string | null
    earnedExp?: Decimal | DecimalJsLike | number | string | null
    lootItems?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ActiveProgramCreateOrConnectWithoutProgramTypeInput = {
    where: ActiveProgramWhereUniqueInput
    create: XOR<ActiveProgramCreateWithoutProgramTypeInput, ActiveProgramUncheckedCreateWithoutProgramTypeInput>
  }

  export type ActiveProgramCreateManyProgramTypeInputEnvelope = {
    data: ActiveProgramCreateManyProgramTypeInput | ActiveProgramCreateManyProgramTypeInput[]
    skipDuplicates?: boolean
  }

  export type ActiveProgramUpsertWithWhereUniqueWithoutProgramTypeInput = {
    where: ActiveProgramWhereUniqueInput
    update: XOR<ActiveProgramUpdateWithoutProgramTypeInput, ActiveProgramUncheckedUpdateWithoutProgramTypeInput>
    create: XOR<ActiveProgramCreateWithoutProgramTypeInput, ActiveProgramUncheckedCreateWithoutProgramTypeInput>
  }

  export type ActiveProgramUpdateWithWhereUniqueWithoutProgramTypeInput = {
    where: ActiveProgramWhereUniqueInput
    data: XOR<ActiveProgramUpdateWithoutProgramTypeInput, ActiveProgramUncheckedUpdateWithoutProgramTypeInput>
  }

  export type ActiveProgramUpdateManyWithWhereWithoutProgramTypeInput = {
    where: ActiveProgramScalarWhereInput
    data: XOR<ActiveProgramUpdateManyMutationInput, ActiveProgramUncheckedUpdateManyWithoutProgramTypeInput>
  }

  export type UserCreateWithoutActiveProgramsInput = {
    id?: string
    email: string
    username: string
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastLoginAt?: Date | string | null
    lastActiveAt?: Date | string | null
    progression?: ProgressionCreateNestedOneWithoutUserInput
    ownedItems?: OwnedItemCreateNestedManyWithoutUserInput
    transactions?: TransactionCreateNestedManyWithoutUserInput
    achievements?: UserAchievementCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutActiveProgramsInput = {
    id?: string
    email: string
    username: string
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastLoginAt?: Date | string | null
    lastActiveAt?: Date | string | null
    progression?: ProgressionUncheckedCreateNestedOneWithoutUserInput
    ownedItems?: OwnedItemUncheckedCreateNestedManyWithoutUserInput
    transactions?: TransactionUncheckedCreateNestedManyWithoutUserInput
    achievements?: UserAchievementUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutActiveProgramsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutActiveProgramsInput, UserUncheckedCreateWithoutActiveProgramsInput>
  }

  export type ProgramTypeCreateWithoutActiveProgramsInput = {
    id?: string
    slug: string
    name: string
    description: string
    baseDurationSecs: number
    baseReward: Decimal | DecimalJsLike | number | string
    experienceReward: Decimal | DecimalJsLike | number | string
    rewardMultiplier?: number
    unlockLevel?: number
    lootTable?: NullableJsonNullValueInput | InputJsonValue
    iconUrl?: string | null
    category: $Enums.ProgramCategory
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProgramTypeUncheckedCreateWithoutActiveProgramsInput = {
    id?: string
    slug: string
    name: string
    description: string
    baseDurationSecs: number
    baseReward: Decimal | DecimalJsLike | number | string
    experienceReward: Decimal | DecimalJsLike | number | string
    rewardMultiplier?: number
    unlockLevel?: number
    lootTable?: NullableJsonNullValueInput | InputJsonValue
    iconUrl?: string | null
    category: $Enums.ProgramCategory
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProgramTypeCreateOrConnectWithoutActiveProgramsInput = {
    where: ProgramTypeWhereUniqueInput
    create: XOR<ProgramTypeCreateWithoutActiveProgramsInput, ProgramTypeUncheckedCreateWithoutActiveProgramsInput>
  }

  export type UserUpsertWithoutActiveProgramsInput = {
    update: XOR<UserUpdateWithoutActiveProgramsInput, UserUncheckedUpdateWithoutActiveProgramsInput>
    create: XOR<UserCreateWithoutActiveProgramsInput, UserUncheckedCreateWithoutActiveProgramsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutActiveProgramsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutActiveProgramsInput, UserUncheckedUpdateWithoutActiveProgramsInput>
  }

  export type UserUpdateWithoutActiveProgramsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastActiveAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    progression?: ProgressionUpdateOneWithoutUserNestedInput
    ownedItems?: OwnedItemUpdateManyWithoutUserNestedInput
    transactions?: TransactionUpdateManyWithoutUserNestedInput
    achievements?: UserAchievementUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutActiveProgramsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastActiveAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    progression?: ProgressionUncheckedUpdateOneWithoutUserNestedInput
    ownedItems?: OwnedItemUncheckedUpdateManyWithoutUserNestedInput
    transactions?: TransactionUncheckedUpdateManyWithoutUserNestedInput
    achievements?: UserAchievementUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ProgramTypeUpsertWithoutActiveProgramsInput = {
    update: XOR<ProgramTypeUpdateWithoutActiveProgramsInput, ProgramTypeUncheckedUpdateWithoutActiveProgramsInput>
    create: XOR<ProgramTypeCreateWithoutActiveProgramsInput, ProgramTypeUncheckedCreateWithoutActiveProgramsInput>
    where?: ProgramTypeWhereInput
  }

  export type ProgramTypeUpdateToOneWithWhereWithoutActiveProgramsInput = {
    where?: ProgramTypeWhereInput
    data: XOR<ProgramTypeUpdateWithoutActiveProgramsInput, ProgramTypeUncheckedUpdateWithoutActiveProgramsInput>
  }

  export type ProgramTypeUpdateWithoutActiveProgramsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    baseDurationSecs?: IntFieldUpdateOperationsInput | number
    baseReward?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    experienceReward?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rewardMultiplier?: FloatFieldUpdateOperationsInput | number
    unlockLevel?: IntFieldUpdateOperationsInput | number
    lootTable?: NullableJsonNullValueInput | InputJsonValue
    iconUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: EnumProgramCategoryFieldUpdateOperationsInput | $Enums.ProgramCategory
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProgramTypeUncheckedUpdateWithoutActiveProgramsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    baseDurationSecs?: IntFieldUpdateOperationsInput | number
    baseReward?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    experienceReward?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rewardMultiplier?: FloatFieldUpdateOperationsInput | number
    unlockLevel?: IntFieldUpdateOperationsInput | number
    lootTable?: NullableJsonNullValueInput | InputJsonValue
    iconUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: EnumProgramCategoryFieldUpdateOperationsInput | $Enums.ProgramCategory
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutTransactionsInput = {
    id?: string
    email: string
    username: string
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastLoginAt?: Date | string | null
    lastActiveAt?: Date | string | null
    progression?: ProgressionCreateNestedOneWithoutUserInput
    ownedItems?: OwnedItemCreateNestedManyWithoutUserInput
    activePrograms?: ActiveProgramCreateNestedManyWithoutUserInput
    achievements?: UserAchievementCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTransactionsInput = {
    id?: string
    email: string
    username: string
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastLoginAt?: Date | string | null
    lastActiveAt?: Date | string | null
    progression?: ProgressionUncheckedCreateNestedOneWithoutUserInput
    ownedItems?: OwnedItemUncheckedCreateNestedManyWithoutUserInput
    activePrograms?: ActiveProgramUncheckedCreateNestedManyWithoutUserInput
    achievements?: UserAchievementUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTransactionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTransactionsInput, UserUncheckedCreateWithoutTransactionsInput>
  }

  export type UserUpsertWithoutTransactionsInput = {
    update: XOR<UserUpdateWithoutTransactionsInput, UserUncheckedUpdateWithoutTransactionsInput>
    create: XOR<UserCreateWithoutTransactionsInput, UserUncheckedCreateWithoutTransactionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTransactionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTransactionsInput, UserUncheckedUpdateWithoutTransactionsInput>
  }

  export type UserUpdateWithoutTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastActiveAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    progression?: ProgressionUpdateOneWithoutUserNestedInput
    ownedItems?: OwnedItemUpdateManyWithoutUserNestedInput
    activePrograms?: ActiveProgramUpdateManyWithoutUserNestedInput
    achievements?: UserAchievementUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastActiveAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    progression?: ProgressionUncheckedUpdateOneWithoutUserNestedInput
    ownedItems?: OwnedItemUncheckedUpdateManyWithoutUserNestedInput
    activePrograms?: ActiveProgramUncheckedUpdateManyWithoutUserNestedInput
    achievements?: UserAchievementUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserAchievementCreateWithoutAchievementInput = {
    id?: string
    unlockedAt?: Date | string
    claimed?: boolean
    claimedAt?: Date | string | null
    user: UserCreateNestedOneWithoutAchievementsInput
  }

  export type UserAchievementUncheckedCreateWithoutAchievementInput = {
    id?: string
    userId: string
    unlockedAt?: Date | string
    claimed?: boolean
    claimedAt?: Date | string | null
  }

  export type UserAchievementCreateOrConnectWithoutAchievementInput = {
    where: UserAchievementWhereUniqueInput
    create: XOR<UserAchievementCreateWithoutAchievementInput, UserAchievementUncheckedCreateWithoutAchievementInput>
  }

  export type UserAchievementCreateManyAchievementInputEnvelope = {
    data: UserAchievementCreateManyAchievementInput | UserAchievementCreateManyAchievementInput[]
    skipDuplicates?: boolean
  }

  export type UserAchievementUpsertWithWhereUniqueWithoutAchievementInput = {
    where: UserAchievementWhereUniqueInput
    update: XOR<UserAchievementUpdateWithoutAchievementInput, UserAchievementUncheckedUpdateWithoutAchievementInput>
    create: XOR<UserAchievementCreateWithoutAchievementInput, UserAchievementUncheckedCreateWithoutAchievementInput>
  }

  export type UserAchievementUpdateWithWhereUniqueWithoutAchievementInput = {
    where: UserAchievementWhereUniqueInput
    data: XOR<UserAchievementUpdateWithoutAchievementInput, UserAchievementUncheckedUpdateWithoutAchievementInput>
  }

  export type UserAchievementUpdateManyWithWhereWithoutAchievementInput = {
    where: UserAchievementScalarWhereInput
    data: XOR<UserAchievementUpdateManyMutationInput, UserAchievementUncheckedUpdateManyWithoutAchievementInput>
  }

  export type UserCreateWithoutAchievementsInput = {
    id?: string
    email: string
    username: string
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastLoginAt?: Date | string | null
    lastActiveAt?: Date | string | null
    progression?: ProgressionCreateNestedOneWithoutUserInput
    ownedItems?: OwnedItemCreateNestedManyWithoutUserInput
    activePrograms?: ActiveProgramCreateNestedManyWithoutUserInput
    transactions?: TransactionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAchievementsInput = {
    id?: string
    email: string
    username: string
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastLoginAt?: Date | string | null
    lastActiveAt?: Date | string | null
    progression?: ProgressionUncheckedCreateNestedOneWithoutUserInput
    ownedItems?: OwnedItemUncheckedCreateNestedManyWithoutUserInput
    activePrograms?: ActiveProgramUncheckedCreateNestedManyWithoutUserInput
    transactions?: TransactionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAchievementsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAchievementsInput, UserUncheckedCreateWithoutAchievementsInput>
  }

  export type AchievementCreateWithoutUserAchievementsInput = {
    id?: string
    slug: string
    name: string
    description: string
    conditionType: $Enums.AchievementCondition
    conditionValue: Decimal | DecimalJsLike | number | string
    rewardLoC?: Decimal | DecimalJsLike | number | string | null
    rewardExp?: Decimal | DecimalJsLike | number | string | null
    rewardItemSlug?: string | null
    iconUrl?: string | null
    points?: number
    hidden?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AchievementUncheckedCreateWithoutUserAchievementsInput = {
    id?: string
    slug: string
    name: string
    description: string
    conditionType: $Enums.AchievementCondition
    conditionValue: Decimal | DecimalJsLike | number | string
    rewardLoC?: Decimal | DecimalJsLike | number | string | null
    rewardExp?: Decimal | DecimalJsLike | number | string | null
    rewardItemSlug?: string | null
    iconUrl?: string | null
    points?: number
    hidden?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AchievementCreateOrConnectWithoutUserAchievementsInput = {
    where: AchievementWhereUniqueInput
    create: XOR<AchievementCreateWithoutUserAchievementsInput, AchievementUncheckedCreateWithoutUserAchievementsInput>
  }

  export type UserUpsertWithoutAchievementsInput = {
    update: XOR<UserUpdateWithoutAchievementsInput, UserUncheckedUpdateWithoutAchievementsInput>
    create: XOR<UserCreateWithoutAchievementsInput, UserUncheckedCreateWithoutAchievementsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAchievementsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAchievementsInput, UserUncheckedUpdateWithoutAchievementsInput>
  }

  export type UserUpdateWithoutAchievementsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastActiveAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    progression?: ProgressionUpdateOneWithoutUserNestedInput
    ownedItems?: OwnedItemUpdateManyWithoutUserNestedInput
    activePrograms?: ActiveProgramUpdateManyWithoutUserNestedInput
    transactions?: TransactionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAchievementsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastActiveAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    progression?: ProgressionUncheckedUpdateOneWithoutUserNestedInput
    ownedItems?: OwnedItemUncheckedUpdateManyWithoutUserNestedInput
    activePrograms?: ActiveProgramUncheckedUpdateManyWithoutUserNestedInput
    transactions?: TransactionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type AchievementUpsertWithoutUserAchievementsInput = {
    update: XOR<AchievementUpdateWithoutUserAchievementsInput, AchievementUncheckedUpdateWithoutUserAchievementsInput>
    create: XOR<AchievementCreateWithoutUserAchievementsInput, AchievementUncheckedCreateWithoutUserAchievementsInput>
    where?: AchievementWhereInput
  }

  export type AchievementUpdateToOneWithWhereWithoutUserAchievementsInput = {
    where?: AchievementWhereInput
    data: XOR<AchievementUpdateWithoutUserAchievementsInput, AchievementUncheckedUpdateWithoutUserAchievementsInput>
  }

  export type AchievementUpdateWithoutUserAchievementsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    conditionType?: EnumAchievementConditionFieldUpdateOperationsInput | $Enums.AchievementCondition
    conditionValue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rewardLoC?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    rewardExp?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    rewardItemSlug?: NullableStringFieldUpdateOperationsInput | string | null
    iconUrl?: NullableStringFieldUpdateOperationsInput | string | null
    points?: IntFieldUpdateOperationsInput | number
    hidden?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AchievementUncheckedUpdateWithoutUserAchievementsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    conditionType?: EnumAchievementConditionFieldUpdateOperationsInput | $Enums.AchievementCondition
    conditionValue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rewardLoC?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    rewardExp?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    rewardItemSlug?: NullableStringFieldUpdateOperationsInput | string | null
    iconUrl?: NullableStringFieldUpdateOperationsInput | string | null
    points?: IntFieldUpdateOperationsInput | number
    hidden?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OwnedItemCreateManyUserInput = {
    id?: string
    itemId: string
    quantity?: number
    level?: number
    purchasedAt?: Date | string
    updatedAt?: Date | string
  }

  export type ActiveProgramCreateManyUserInput = {
    id?: string
    programTypeId: string
    startedAt?: Date | string
    estimatedEndAt: Date | string
    completedAt?: Date | string | null
    status?: $Enums.ProgramStatus
    bullJobId?: string | null
    earnedReward?: Decimal | DecimalJsLike | number | string | null
    earnedExp?: Decimal | DecimalJsLike | number | string | null
    lootItems?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionCreateManyUserInput = {
    id?: string
    stripePaymentId: string
    stripeCustomerId?: string | null
    amountCents: number
    currency?: string
    status?: $Enums.TransactionStatus
    processedAt?: Date | string | null
    idempotencyKey: string
    productType: $Enums.ProductType
    productData: JsonNullValueInput | InputJsonValue
    fulfilled?: boolean
    fulfilledAt?: Date | string | null
    fulfillmentJobId?: string | null
    lastError?: string | null
    retryCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserAchievementCreateManyUserInput = {
    id?: string
    achievementId: string
    unlockedAt?: Date | string
    claimed?: boolean
    claimedAt?: Date | string | null
  }

  export type OwnedItemUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    level?: IntFieldUpdateOperationsInput | number
    purchasedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    item?: ItemUpdateOneRequiredWithoutOwnedItemsNestedInput
  }

  export type OwnedItemUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    itemId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    level?: IntFieldUpdateOperationsInput | number
    purchasedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OwnedItemUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    itemId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    level?: IntFieldUpdateOperationsInput | number
    purchasedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActiveProgramUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    estimatedEndAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumProgramStatusFieldUpdateOperationsInput | $Enums.ProgramStatus
    bullJobId?: NullableStringFieldUpdateOperationsInput | string | null
    earnedReward?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    earnedExp?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lootItems?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    programType?: ProgramTypeUpdateOneRequiredWithoutActiveProgramsNestedInput
  }

  export type ActiveProgramUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    programTypeId?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    estimatedEndAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumProgramStatusFieldUpdateOperationsInput | $Enums.ProgramStatus
    bullJobId?: NullableStringFieldUpdateOperationsInput | string | null
    earnedReward?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    earnedExp?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lootItems?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActiveProgramUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    programTypeId?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    estimatedEndAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumProgramStatusFieldUpdateOperationsInput | $Enums.ProgramStatus
    bullJobId?: NullableStringFieldUpdateOperationsInput | string | null
    earnedReward?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    earnedExp?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lootItems?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripePaymentId?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    amountCents?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    productType?: EnumProductTypeFieldUpdateOperationsInput | $Enums.ProductType
    productData?: JsonNullValueInput | InputJsonValue
    fulfilled?: BoolFieldUpdateOperationsInput | boolean
    fulfilledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fulfillmentJobId?: NullableStringFieldUpdateOperationsInput | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    retryCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripePaymentId?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    amountCents?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    productType?: EnumProductTypeFieldUpdateOperationsInput | $Enums.ProductType
    productData?: JsonNullValueInput | InputJsonValue
    fulfilled?: BoolFieldUpdateOperationsInput | boolean
    fulfilledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fulfillmentJobId?: NullableStringFieldUpdateOperationsInput | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    retryCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripePaymentId?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    amountCents?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumTransactionStatusFieldUpdateOperationsInput | $Enums.TransactionStatus
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    productType?: EnumProductTypeFieldUpdateOperationsInput | $Enums.ProductType
    productData?: JsonNullValueInput | InputJsonValue
    fulfilled?: BoolFieldUpdateOperationsInput | boolean
    fulfilledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fulfillmentJobId?: NullableStringFieldUpdateOperationsInput | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    retryCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserAchievementUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    unlockedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    claimed?: BoolFieldUpdateOperationsInput | boolean
    claimedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    achievement?: AchievementUpdateOneRequiredWithoutUserAchievementsNestedInput
  }

  export type UserAchievementUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    achievementId?: StringFieldUpdateOperationsInput | string
    unlockedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    claimed?: BoolFieldUpdateOperationsInput | boolean
    claimedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserAchievementUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    achievementId?: StringFieldUpdateOperationsInput | string
    unlockedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    claimed?: BoolFieldUpdateOperationsInput | boolean
    claimedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type OwnedItemCreateManyItemInput = {
    id?: string
    userId: string
    quantity?: number
    level?: number
    purchasedAt?: Date | string
    updatedAt?: Date | string
  }

  export type OwnedItemUpdateWithoutItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    level?: IntFieldUpdateOperationsInput | number
    purchasedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutOwnedItemsNestedInput
  }

  export type OwnedItemUncheckedUpdateWithoutItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    level?: IntFieldUpdateOperationsInput | number
    purchasedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OwnedItemUncheckedUpdateManyWithoutItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    level?: IntFieldUpdateOperationsInput | number
    purchasedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActiveProgramCreateManyProgramTypeInput = {
    id?: string
    userId: string
    startedAt?: Date | string
    estimatedEndAt: Date | string
    completedAt?: Date | string | null
    status?: $Enums.ProgramStatus
    bullJobId?: string | null
    earnedReward?: Decimal | DecimalJsLike | number | string | null
    earnedExp?: Decimal | DecimalJsLike | number | string | null
    lootItems?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ActiveProgramUpdateWithoutProgramTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    estimatedEndAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumProgramStatusFieldUpdateOperationsInput | $Enums.ProgramStatus
    bullJobId?: NullableStringFieldUpdateOperationsInput | string | null
    earnedReward?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    earnedExp?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lootItems?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutActiveProgramsNestedInput
  }

  export type ActiveProgramUncheckedUpdateWithoutProgramTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    estimatedEndAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumProgramStatusFieldUpdateOperationsInput | $Enums.ProgramStatus
    bullJobId?: NullableStringFieldUpdateOperationsInput | string | null
    earnedReward?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    earnedExp?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lootItems?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActiveProgramUncheckedUpdateManyWithoutProgramTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    estimatedEndAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumProgramStatusFieldUpdateOperationsInput | $Enums.ProgramStatus
    bullJobId?: NullableStringFieldUpdateOperationsInput | string | null
    earnedReward?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    earnedExp?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lootItems?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserAchievementCreateManyAchievementInput = {
    id?: string
    userId: string
    unlockedAt?: Date | string
    claimed?: boolean
    claimedAt?: Date | string | null
  }

  export type UserAchievementUpdateWithoutAchievementInput = {
    id?: StringFieldUpdateOperationsInput | string
    unlockedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    claimed?: BoolFieldUpdateOperationsInput | boolean
    claimedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutAchievementsNestedInput
  }

  export type UserAchievementUncheckedUpdateWithoutAchievementInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    unlockedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    claimed?: BoolFieldUpdateOperationsInput | boolean
    claimedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserAchievementUncheckedUpdateManyWithoutAchievementInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    unlockedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    claimed?: BoolFieldUpdateOperationsInput | boolean
    claimedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ItemCountOutputTypeDefaultArgs instead
     */
    export type ItemCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ItemCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProgramTypeCountOutputTypeDefaultArgs instead
     */
    export type ProgramTypeCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProgramTypeCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AchievementCountOutputTypeDefaultArgs instead
     */
    export type AchievementCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AchievementCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProgressionDefaultArgs instead
     */
    export type ProgressionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProgressionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ItemDefaultArgs instead
     */
    export type ItemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ItemDefaultArgs<ExtArgs>
    /**
     * @deprecated Use OwnedItemDefaultArgs instead
     */
    export type OwnedItemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = OwnedItemDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProgramTypeDefaultArgs instead
     */
    export type ProgramTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProgramTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ActiveProgramDefaultArgs instead
     */
    export type ActiveProgramArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ActiveProgramDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TransactionDefaultArgs instead
     */
    export type TransactionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TransactionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AchievementDefaultArgs instead
     */
    export type AchievementArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AchievementDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserAchievementDefaultArgs instead
     */
    export type UserAchievementArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserAchievementDefaultArgs<ExtArgs>
    /**
     * @deprecated Use OfflineSessionDefaultArgs instead
     */
    export type OfflineSessionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = OfflineSessionDefaultArgs<ExtArgs>

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