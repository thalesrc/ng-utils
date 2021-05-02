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
  // tslint:disable-next-line:variable-name
  private _states: HistoryItem[] = [{state: null, title: '', url: ''}];

  /** Registered hash change listener */
  // tslint:disable-next-line:variable-name
  private _hashChangeListener: LocationChangeListener = noop;

  /** Registered pop state listener */
  // tslint:disable-next-line:variable-name
  private _popStateListener: LocationChangeListener = noop;

  /** Current state index in `_states` */
  // tslint:disable-next-line:variable-name
  private _currentIndex = 0;

  /** Current state */
  private get _currentState(): HistoryItem {
    return this._states[this._currentIndex];
  }

  /**
   * Hash string in current state url
   * Implementation of `PlatformLocation`
   */
  public get hash(): string {
    return this._currentState.url.split('#')[1] || '';
  }

  /**
   * Current state url pathname
   * Implementation of `PlatformLocation`
   */
  public get pathname(): string {
    return this._currentState.url;
  }

  public set pathname(pathname: string) {
    this.pushState(null, this._currentState.title, pathname);
  }

  public get hostname(): string {
    return '';
  }

  public get href(): string {
    return '';
  }

  public get protocol(): string {
    return '';
  }

  public get port(): string {
    return '';
  }

  /**
   * Search string in current state url
   * Implementation of `PlatformLocation`
   */
  public get search(): string {
    return (this._currentState.url.split('?')[1] || '').split('#')[0];
  }

  /**
   * Returns empty string for baseHref
   * Implementation of `PlatformLocation`
   */
  public getBaseHrefFromDOM(): string {
    return '';
  }

  /**
   * Navigates to previous state in history
   * Implementation of `PlatformLocation`
   */
  public back(): void {
    const newIndex = minMax(0, Number.MAX_SAFE_INTEGER, this._currentIndex - 1);
    const previousHash = this.hash;

    this._currentIndex = newIndex;
    this._popStateListener({state: this._currentState.state, type: POPSTATE_EVENT_TYPE});

    if (previousHash !== this.hash) {
      this._hashChangeListener({state: this._currentState.state, type: HASHCHANGE_EVENT_TYPE});
    }
  }

  /**
   * Navigates to next state in history
   * Implementation of `PlatformLocation`
   */
  public forward(): void {
    const newIndex = minMax(0, this._states.length - 1, this._currentIndex + 1);
    const previousHash = this.hash;

    this._currentIndex = newIndex;
    this._popStateListener({state: this._currentState.state, type: POPSTATE_EVENT_TYPE});

    if (previousHash !== this.hash) {
      this._hashChangeListener({state: this._currentState.state, type: HASHCHANGE_EVENT_TYPE});
    }
  }

  /**
   * Register a callback to call on hash changes
   * Implementation of `PlatformLocation`
   *
   * @param fn Function to call on hash changes
   */
  public onHashChange(fn: LocationChangeListener): void {
    this._hashChangeListener = fn;
  }

  /**
   * Register a callback to call on popstate events
   * Implementation of `PlatformLocation`
   *
   * @param fn Function to call on popstate events
   */
  public onPopState(fn: LocationChangeListener): void {
    this._popStateListener = fn;
  }

  /**
   * Push a new history object into the state
   * Implementation of `PlatformLocation`
   *
   * @param state State object of new history item
   * @param title Title of new history item
   * @param url Url of new history item
   */
  public pushState(state: any, title: string, url: string): void {
    const stateObject: HistoryItem = {state, title, url};
    const previousHash = this.hash;

    this._states.push(stateObject);
    this._currentIndex++;

    this._popStateListener({state: stateObject.state, type: POPSTATE_EVENT_TYPE});

    if (previousHash !== this.hash) {
      this._hashChangeListener({state: stateObject.state, type: HASHCHANGE_EVENT_TYPE});
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
  public replaceState(state: any, title: string, url: string) {
    const stateObject: HistoryItem = {state, title, url};
    const previousHash = this.hash;

    this._states = replace(this._states, this._currentState, stateObject);
    this._states.length = this._currentIndex + 1;

    this._popStateListener({state: stateObject.state, type: POPSTATE_EVENT_TYPE});

    if (previousHash !== this.hash) {
      this._hashChangeListener({state: stateObject.state, type: HASHCHANGE_EVENT_TYPE});
    }
  }

  public getState() {
    return this._currentState;
  }
}
