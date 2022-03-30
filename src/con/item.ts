import { MyObject3D } from "../webgl/myObject3D";
import { Func } from "../core/func";
import { Param } from '../core/param';
import { Val } from "../libs/val";
import { Mesh } from 'three/src/objects/Mesh';
import { Util } from "../libs/util";
import { Tween } from "../core/tween";
import { Elastic,Power4 } from "gsap";
import { Conf } from "../core/conf";

export class Item extends MyObject3D {

  private _id:number = 0;
  private _mesh:Mesh
  private _showVal:Val = new Val(0)
  private _isShow:boolean = false

  public dist:number = 0;

  constructor(opt:any) {
    super()

    this._id = opt.id + 1;

    this._mesh = new Mesh(opt.geo, opt.mat)
    this.add(this._mesh)

    const sw = Func.instance.sw()
    const sh = Func.instance.sh()
    this.position.x = Util.instance.range(sw * 0.5)
    this.position.y = Util.instance.range(sh * 0.5)

    const dx = this.position.x
    const dy = this.position.y - Func.instance.sh() * -0.5
    this.dist = Math.sqrt(dx * dx + dy * dy)

    let s = Util.instance.random(sw * 0.2, sw * 0.45)
    this.scale.set(s, s, 1)
  }


  // ---------------------------------
  //
  // ---------------------------------
  public resetId(id:number):void {
    this._id = id;
  }


  // ---------------------------------
  //
  // ---------------------------------
  private _show():void {
    if(this._isShow) return
    this._isShow = true

    const e = Elastic.easeOut.config(1, 0.3)
    Tween.instance.a(this._showVal, {
      val:1
    }, 1, 0, e)
  }


  // ---------------------------------
  //
  // ---------------------------------
  private _hide():void {
    if(!this._isShow) return
    this._isShow = false

    const e = Power4.easeOut
    Tween.instance.a(this._showVal, {
      val:0
    }, 0.25, 0, e)
  }


  // ---------------------------------
  // 更新
  // ---------------------------------
  protected _update():void {
    super._update()

    // 表示チェック
    const test = Param.instance.ang
    if(test >= this._id * ((360 * (Conf.instance.ROT - 1)) / Conf.instance.NUM)) {
      this._show()
    } else {
      this._hide()
    }

    const radian = Util.instance.radian(this._c * 2)
    let posRange = 0.2
    this._mesh.position.x = Math.sin(radian * 1.12) * posRange
    this._mesh.position.y = Math.cos(radian * -0.87) * posRange

    let s = Util.instance.map(Math.sin(radian * -1.52), 0.85, 1.25, -1, 1)
    s *= Util.instance.map(this._showVal.val, 0.00000001, 1, 0, 1.5)
    this._mesh.scale.set(s, s, 1)
  }
}