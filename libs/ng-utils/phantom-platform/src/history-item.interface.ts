/**
 * History item
 */
export interface HistoryItem {
  /**
   * State of the history object
   */
  state: any; // eslint-disable-line @typescript-eslint/no-explicit-any

  /**
   * Title of the history object
   */
  title: string;

  /**
   * Url of the history object
   */
  url: string;
}
