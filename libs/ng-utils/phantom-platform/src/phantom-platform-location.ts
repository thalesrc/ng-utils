import { LocationChangeListener, PlatformLocation } from '@angular/common';
import { Injectable } from '@angular/core';
import { minMax } from '@thalesrc/js-utils/math/min-max';
import { noop } from '@thalesrc/js-utils/function/noop';
import { replace } from '@thalesrc/js-utils/array/replace';

import { HASHCHANGE_EVENT_TYPE, POPSTATE_EVENT_TYPE } from './history-event-types';
import { HistoryItem } from './history-item.interface';

/**
 * Ghost Platform Location
 *
 * A platform location provider class to use Router without manipulation or reading url
 */
@Injectable()
export class PhantomPlatformLocation extends PlatformLocation {
  /** History states */
  #states: HistoryItem[] = [{state: null, title: '', url: ''}];

  /** Registered hash change listener */
  #hashChangeListener: LocationChangeListener = noop;

  /** Registered pop state listener */
  #popStateListener: LocationChangeListener = noop;

  /** Current state index in `_states` */
  #currentIndex = 0;

  /** Current state */
  get #currentState(): HistoryItem {
    return this.#states[this.#currentIndex];
  }

  /**
   * Hash string in current state url
   * Implementation of `PlatformLocation`
   */
  get hash(): string {
    return this.#currentState.url.split('#')[1] || '';
  }

  /**
   * Current state url pathname
   * Implementation of `PlatformLocation`
   */
  get pathname(): string {
    return this.#currentState.url;
  }

  set pathname(pathname: string) {
    this.pushState(null, this.#currentState.title, pathname);
  }

  get hostname(): string {
    return '';
  }

  get href(): string {
    return '';
  }

  get protocol(): string {
    return '';
  }

  get port(): string {
    return '';
  }

  /**
   * Search string in current state url
   * Implementation of `PlatformLocation`
   */
  get search(): string {
    return (this.#currentState.url.split('?')[1] || '').split('#')[0];
  }

  /**
   * Returns empty string for baseHref
   * Implementation of `PlatformLocation`
   */
  getBaseHrefFromDOM(): string {
    return '';
  }

  /**
   * Navigates to previous state in history
   * Implementation of `PlatformLocation`
   */
  back(): void {
    const newIndex = minMax(0, Number.MAX_SAFE_INTEGER, this.#currentIndex - 1);
    const previousHash = this.hash;

    this.#currentIndex = newIndex;
    this.#popStateListener({state: this.#currentState.state, type: POPSTATE_EVENT_TYPE});

    if (previousHash !== this.hash) {
      this.#hashChangeListener({state: this.#currentState.state, type: HASHCHANGE_EVENT_TYPE});
    }
  }

  /**
   * Navigates to next state in history
   * Implementation of `PlatformLocation`
   */
  forward(): void {
    const newIndex = minMax(0, this.#states.length - 1, this.#currentIndex + 1);
    const previousHash = this.hash;

    this.#currentIndex = newIndex;
    this.#popStateListener({state: this.#currentState.state, type: POPSTATE_EVENT_TYPE});

    if (previousHash !== this.hash) {
      this.#hashChangeListener({state: this.#currentState.state, type: HASHCHANGE_EVENT_TYPE});
    }
  }

  /**
   * Register a callback to call on hash changes
   * Implementation of `PlatformLocation`
   *
   * @param fn Function to call on hash changes
   */
  onHashChange(fn: LocationChangeListener): VoidFunction {
    this.#hashChangeListener = fn;

		return () => {}
  }

  /**
   * Register a callback to call on popstate events
   * Implementation of `PlatformLocation`
   *
   * @param fn Function to call on popstate events
   */
  onPopState(fn: LocationChangeListener): VoidFunction {
    this.#popStateListener = fn;

		return () => {}
  }

  /**
   * Push a new history object into the state
   * Implementation of `PlatformLocation`
   *
   * @param state State object of new history item
   * @param title Title of new history item
   * @param url Url of new history item
   */
  pushState(state: any, title: string, url: string): void { // eslint-disable-line @typescript-eslint/no-explicit-any
    const stateObject: HistoryItem = {state, title, url};
    const previousHash = this.hash;

    this.#states.push(stateObject);
    this.#currentIndex++;

    this.#popStateListener({state: stateObject.state, type: POPSTATE_EVENT_TYPE});

    if (previousHash !== this.hash) {
      this.#hashChangeListener({state: stateObject.state, type: HASHCHANGE_EVENT_TYPE});
    }
  }

  /**
   * Replace the current history item with a new one
   * Implementation of `PlatformLocation`
   *
   * @param state State object of new history item
   * @param title Title of new history item
   * @param url Url of new history item
   */
  replaceState(state: any, title: string, url: string) { // eslint-disable-line @typescript-eslint/no-explicit-any
    const stateObject: HistoryItem = {state, title, url};
    const previousHash = this.hash;

    this.#states = replace(this.#states, this.#currentState, stateObject);
    this.#states.length = this.#currentIndex + 1;

    if (previousHash !== this.hash) {
      this.#hashChangeListener({state: stateObject.state, type: HASHCHANGE_EVENT_TYPE});
    }
  }

  getState() {
    return this.#currentState;
  }
}
