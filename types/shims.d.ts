declare module "unexpected" {
  interface Expect {
    (subject: unknown, assertion: string, ...rest: unknown[]): unknown
    clone(): Expect
    addAssertion(
      pattern: string,
      handler: (...args: unknown[]) => unknown,
    ): Expect
  }
  const expect: Expect
  export default expect
}

declare module "@datatypes/config"
