import { useUiStore } from '@/stores/ui';

/**
 * A higher-order function that wraps an asynchronous action with a global transition state.
 * It ensures the transition starts before the action and ends after it completes,
 * even if the action fails.
 * @param {Function} asyncAction - The asynchronous function/action to execute.
 * @returns {Promise<any>} A promise that resolves with the return value of the asyncAction.
 */
export async function withTransition(asyncAction) {
  const uiStore = useUiStore();
  uiStore.startTransition();

  try {
    // Execute the action and wait for it to complete
    const result = await asyncAction();
    return result;
  } catch (error) {
    // Re-throw the error so the original caller can handle it if needed
    console.error("An error occurred during a transitioned action:", error);
    throw error;
  } finally {
    // This 'finally' block GUARANTEES that the transition ends,
    // even if the action above throws an error. This is crucial for robustness.
    uiStore.endTransition();
  }
}
