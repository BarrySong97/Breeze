import moment from "moment";
/**
 * 10s 就按描述来分
 * 切块点 有可能是
 * 1s 5s 10s 15s 20s 25s 递增
 * 最多分成十块
 * width / 10
 * rate = width / duration (s/px) 100px 10s 那么每一px就是 10 / 100 =  0.1s/px 1s就是 10px
 */

const TIMEPOINT = [
  0.1, 0.01, 1, 3, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 120, 180, 240,
  300, 360, 420, 480, 540, 600, 660, 720, 780, 840, 900, 960, 1200,
];
class TimeScale {
  width: number;
  duration: number;
  canvas: HTMLCanvasElement;
  constructor(width: number, duration: number, canvas: HTMLCanvasElement) {
    this.duration = duration;
    this.canvas = canvas;
    this.canvas.height = 40;
    this.canvas.width = 664;
    this.width = canvas.width;
  }

  getCloseNumber(n: number) {
    let min = Infinity;
    let j = 0;
    for (let i = 0; i < TIMEPOINT.length; i++) {
      const sub = Math.abs(TIMEPOINT[i] - n);
      if (sub < min) {
        min = sub;
        j = i;
      }
    }
    return TIMEPOINT[j];
  }

  draw() {
    const { duration, width, canvas } = this;
    // 先把时间分成十份，然后再UNIT里面找到离这个值最近的数字
    const closeUnit = duration / 9;
    // 找到的数字作为单位来切割
    const realUnit = this.getCloseNumber(closeUnit);
    // 算出每一个单位之间的宽度
    const length = duration / realUnit;
    const gutter = width / length;
    this.drawTimePointLine(
      gutter,
      // 这个是画几次也就是分割出来的次数，如果是小数，小数部分就不要了，作为多出但是不超过一份的显示
      Math.floor(length),
      realUnit
    );
    // this.drawUnitLine();
  }

  /**
   *
   * @param gutter 间隔长度
   * @param length 画几次
   */
  drawTimePointLine(gutter: number, length: number, unit: number) {
    const ctx = this.canvas.getContext("2d");
    const unitGutter = gutter / 10;
    // 画线
    if (ctx) {
      /**
       * 先画整数倍
       */
      for (let i = 0; i <= length; i++) {
        if (i !== 0 || (i === length && gutter * length >= this.width)) {
          ctx.translate(gutter, 0);
          this.drawLine(ctx, "timePoint");
        }
        if (i !== length) {
          ctx.save();
          this.drawText(ctx, moment(unit * 0).format("HH:MM:SS"), 10);
          this.drawUnitLine(ctx, unitGutter, 9);
          ctx.restore();
        }
      }

      /**
       * 检查整数倍之后是否有多余的，如果有就把多余的补上去
       */
      const last = this.width - gutter * length;
      const lasterLength = last / unitGutter;
      this.drawUnitLine(ctx, unitGutter, Math.floor(lasterLength));
    }
  }
  /**
   *
   * @param start 从那个位置开始
   * @param end 从那个位置结束
   * @param length 画几次
   */
  drawUnitLine(ctx: CanvasRenderingContext2D, gutter: number, length: number) {
    for (let i = 0; i < length; i++) {
      ctx.translate(gutter, 0);
      this.drawLine(ctx, "unit");
    }
  }
  /**
   *
   * @param ctx
   */
  drawLine(ctx: CanvasRenderingContext2D, type: "timePoint" | "unit") {
    ctx.beginPath();
    ctx.moveTo(0, this.canvas.height - (type === "timePoint" ? 16 : 6));
    ctx.lineTo(0, this.canvas.height);
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "#253278";
    ctx.stroke();
  }
  drawText(ctx: CanvasRenderingContext2D, text: string, left: number) {
    ctx.font = "normal 12px Arial";
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#253278";
    ctx.strokeText(text, left, 20);
  }
}

export default TimeScale;
