/**
 * 配置选项接口
 */
interface UndooOptions {
  /** 历史记录的最大长度 */
  maxLength?: number;
  /** 是否在初始化时自动添加初始状态 */
  addInitialState?: boolean;
  /** 当达到最大长度时的处理策略: 'discard-oldest' | 'prevent-new' */
  maxLengthStrategy?: "discard-oldest" | "prevent-new";
}

/**
 * 历史记录项接口
 */
export type UndooItem = {
  /** 撤销操作 */
  undo: () => void;
  /** 重做操作 */
  redo: () => void;
  /** 可选的操作描述 */
  description?: string;
};

/**
 * 历史状态变更事件类型
 */
export type UndooEventType = "undo" | "redo" | "save" | "clear" | "init";

/**
 * 历史状态变更事件监听器
 */
export type UndooEventListener = (
  eventType: UndooEventType,
  position: number,
  historyLength: number
) => void;

/**
 * Undoo 类 - 提供撤销/重做功能的历史记录管理
 */
class Undoo {
  private _opts: Required<
    Pick<UndooOptions, "maxLength" | "addInitialState" | "maxLengthStrategy">
  >;
  private _history: UndooItem[];
  private _position: number = -1;

  private _eventListeners: UndooEventListener[] = [];
  private _isBatchOperation: boolean = false;
  private _batchedEvents: { type: UndooEventType; position: number }[] = [];
  /**
   * 创建实例
   * @param opts 配置对象
   * @param opts.provider 可选函数，在保存时调用，返回历史记录的新状态
   * @param opts.maxLength 历史记录的最大长度，默认为20
   */
  constructor(opts: UndooOptions = {}) {
    this._opts = {
      maxLength: opts.maxLength ?? 50,
      addInitialState: opts.addInitialState ?? false,
      maxLengthStrategy: opts.maxLengthStrategy ?? "discard-oldest",
    };

    this._history = [];
    this._position = -1;

    if (this._opts.addInitialState) {
      this._history.push({
        undo: () => {},
        redo: () => {},
        description: "Initial state",
      });
    }

    this._notifyListeners("init", this._position, this._history.length);
  }

  /**
   * 检查是否可以撤销
   * @returns 是否可以撤销
   */
  canUndo(): boolean {
    return this._position >= 0;
  }

  /**
   * 检查是否可以重做
   * @returns 是否可以重做
   */
  canRedo(): boolean {
    return this._position < this._history.length - 1;
  }

  /**
   * 获取历史记录
   * @returns 历史记录数组
   */
  history(): any[] {
    return [...this._history];
  }

  getPosition(): number {
    return this._position;
  }

  /**
   * 获取当前历史记录项
   * @returns 当前历史记录项
   */
  current(): UndooItem | null {
    return this._position >= 0 && this._position < this._history.length
      ? this._history[this._position]
      : null;
  }

  /**
   * 保存历史记录
   * @param item 要保存的项
   * @returns this实例
   */
  save(item: UndooItem): Undoo {
    if (this._position < this._history.length - 1) {
      this._history = this._history.slice(0, this._position + 1);
    }

    // 检查是否达到最大长度
    if (this._history.length >= this._opts.maxLength) {
      if (this._opts.maxLengthStrategy === "discard-oldest") {
        // 删除最旧的记录
        this._history.shift();
        this._position--;
      } else if (
        this._opts.maxLengthStrategy === "prevent-new" &&
        this._history.length >= this._opts.maxLength
      ) {
        // 不添加新记录
        return this;
      }
    }
    // 添加新记录
    this._history.push(item);
    this._position++;

    this._notifyListeners("save", this._position, this._history.length);

    return this;
  }

  undo(): void {
    if (!this.canUndo()) {
      console.warn("Undo operation failed: no undo history");
      return;
    }

    try {
      this._history[this._position].undo();
      this._position--;
      this._notifyListeners("undo", this._position, this._history.length);
    } catch (err) {
      console.error("Undo operation failed:", err);
    }
  }

  redo(): void {
    if (!this.canRedo()) {
      return;
    }

    try {
      this._position++;
      this._history[this._position].redo();
      this._notifyListeners("redo", this._position, this._history.length);
    } catch (error) {
      console.error("Error during redo operation:", error);
      this._position--; // 回滚位置
    }
  }

  clear(): Undoo {
    this._history = [];
    this._position = -1;
    this._notifyListeners("clear", this._position, this._history.length);
    return this;
  }

  /**
   * 开始批量操作
   * 在批量操作期间，事件通知会被延迟到批量操作结束时
   */
  beginBatch(): void {
    this._isBatchOperation = true;
    this._batchedEvents = [];
  }

  /**
   * 结束批量操作并触发所有累积的事件
   */
  endBatch(): void {
    this._isBatchOperation = false;

    // 通知所有累积的事件
    for (const event of this._batchedEvents) {
      this._notifyListeners(event.type, event.position, this._history.length);
    }

    this._batchedEvents = [];
  }

  /**
   * 添加事件监听器
   * @param listener 事件监听器函数
   * @returns this实例
   */
  addEventListener(listener: UndooEventListener): Undoo {
    this._eventListeners.push(listener);
    return this;
  }

  /**
   * 移除事件监听器
   * @param listener 要移除的事件监听器函数
   * @returns this实例
   */
  removeEventListener(listener: UndooEventListener): Undoo {
    const index = this._eventListeners.indexOf(listener);
    if (index !== -1) {
      this._eventListeners.splice(index, 1);
    }
    return this;
  }

  /**
   * 通知所有事件监听器
   * @param eventType 事件类型
   * @param position 当前位置
   * @param historyLength 历史记录长度
   * @private
   */
  private _notifyListeners(
    eventType: UndooEventType,
    position: number,
    historyLength: number
  ): void {
    if (this._isBatchOperation) {
      // 在批量操作中，累积事件
      this._batchedEvents.push({ type: eventType, position });
      return;
    }

    // 通知所有监听器
    for (const listener of this._eventListeners) {
      try {
        listener(eventType, position, historyLength);
      } catch (error) {
        console.error("Error in event listener:", error);
      }
    }
  }

  /**
   * 跳转到特定历史位置
   * @param position 目标位置
   * @returns 是否成功跳转
   */
  jumpToPosition(position: number): boolean {
    if (
      position < 0 ||
      position >= this._history.length ||
      position === this._position
    ) {
      return false;
    }

    this.beginBatch();

    try {
      // 如果目标位置在当前位置之前，执行撤销操作
      if (position < this._position) {
        while (this._position > position) {
          this._history[this._position].undo();
          this._position--;
          this._batchedEvents.push({ type: "undo", position: this._position });
        }
      }
      // 如果目标位置在当前位置之后，执行重做操作
      else {
        while (this._position < position) {
          this._position++;
          this._history[this._position].redo();
          this._batchedEvents.push({ type: "redo", position: this._position });
        }
      }

      this.endBatch();
      return true;
    } catch (error) {
      console.error("Error during position jump:", error);
      this.endBatch();
      return false;
    }
  }

  /**
   * 获取历史记录长度
   * @returns 历史记录长度
   */
  length(): number {
    return this._history.length;
  }

  /**
   * 检查历史记录是否为空
   * @returns 是否为空
   */
  isEmpty(): boolean {
    return this._history.length === 0;
  }
}

export default Undoo;
