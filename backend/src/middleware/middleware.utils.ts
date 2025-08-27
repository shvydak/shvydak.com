import {AsyncLocalStorage} from 'async_hooks'

export const testContext: any = new AsyncLocalStorage()

export const isTest = (): boolean => {
    // if (isTestEnv()) {
    //     return true
    // }
    const testId = testContext.getStore()?.get?.('testID')
    return !!testId
}
