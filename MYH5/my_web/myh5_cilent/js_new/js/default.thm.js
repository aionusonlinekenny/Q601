window.skins={};
window.skin={};
                function __extends(d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                        function __() {
                            this.constructor = d;
                        }
                    __.prototype = b.prototype;
                    d.prototype = new __();
                };
                window.generateEUI = {};
                generateEUI.paths = {};
                generateEUI.styles = undefined;
                generateEUI.skins = {"eui.Button":"shell/skins/skin/ButtonSkin.exml","eui.CheckBox":"shell/skins/skin/CheckBoxSkin.exml","eui.HScrollBar":"shell/skins/skin/HScrollBarSkin.exml","eui.HSlider":"shell/skins/skin/HSliderSkin.exml","eui.Panel":"shell/skins/skin/PanelSkin.exml","eui.TextInput":"shell/skins/skin/TextInputSkin.exml","eui.ProgressBar":"shell/skins/skin/ProgressBarSkin.exml","eui.RadioButton":"shell/skins/skin/RadioButtonSkin.exml","eui.Scroller":"shell/skins/skin/ScrollerSkin.exml","eui.ToggleSwitch":"shell/skins/skin/ToggleSwitchSkin.exml","eui.VScrollBar":"shell/skins/skin/VScrollBarSkin.exml","eui.VSlider":"shell/skins/skin/VSliderSkin.exml","eui.ItemRenderer":"shell/skins/skin/ItemRendererSkin.exml","TopupCompleteSkin":"shell/eui_skins/TopupCompleteSkin.exml"};generateEUI.paths['resource/skins/components/ButtonSkin.exml'] = window.skins.ButtonSkin = (function (_super) {
	__extends(ButtonSkin, _super);
	function ButtonSkin() {
		_super.call(this);
		this.skinParts = ["labelDisplay","iconDisplay"];
		
		this.minHeight = 50;
		this.minWidth = 100;
		this.elementsContent = [this._Image1_i(),this.labelDisplay_i(),this.iconDisplay_i()];
		this.states = [
			new eui.State ("up",
				[
				])
			,
			new eui.State ("down",
				[
					new eui.SetProperty("_Image1","source","button_down_png")
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("_Image1","alpha",0.5)
				])
		];
	}
	var _proto = ButtonSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		this._Image1 = t;
		t.percentHeight = 100;
		t.scale9Grid = new egret.Rectangle(1,3,8,8);
		t.source = "button_up_png";
		t.percentWidth = 100;
		return t;
	};
	_proto.labelDisplay_i = function () {
		var t = new eui.Label();
		this.labelDisplay = t;
		t.bottom = 8;
		t.left = 8;
		t.right = 8;
		t.size = 20;
		t.textAlign = "center";
		t.textColor = 0xFFFFFF;
		t.top = 8;
		t.verticalAlign = "middle";
		return t;
	};
	_proto.iconDisplay_i = function () {
		var t = new eui.Image();
		this.iconDisplay = t;
		t.horizontalCenter = 0;
		t.verticalCenter = 0;
		return t;
	};
	return ButtonSkin;
})(eui.Skin);generateEUI.paths['resource/skins/components/CheckBoxSkin.exml'] = window.skins.CheckBoxSkin = (function (_super) {
	__extends(CheckBoxSkin, _super);
	function CheckBoxSkin() {
		_super.call(this);
		this.skinParts = ["labelDisplay"];
		
		this.elementsContent = [this._Group1_i()];
		this.states = [
			new eui.State ("up",
				[
				])
			,
			new eui.State ("down",
				[
					new eui.SetProperty("_Image1","alpha",0.7)
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("_Image1","alpha",0.5)
				])
			,
			new eui.State ("upAndSelected",
				[
					new eui.SetProperty("_Image1","source","checkbox_select_up_png")
				])
			,
			new eui.State ("downAndSelected",
				[
					new eui.SetProperty("_Image1","source","checkbox_select_down_png")
				])
			,
			new eui.State ("disabledAndSelected",
				[
					new eui.SetProperty("_Image1","source","checkbox_select_disabled_png")
				])
		];
	}
	var _proto = CheckBoxSkin.prototype;

	_proto._Group1_i = function () {
		var t = new eui.Group();
		t.percentHeight = 100;
		t.percentWidth = 100;
		t.layout = this._HorizontalLayout1_i();
		t.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
		return t;
	};
	_proto._HorizontalLayout1_i = function () {
		var t = new eui.HorizontalLayout();
		t.verticalAlign = "middle";
		return t;
	};
	_proto._Image1_i = function () {
		var t = new eui.Image();
		this._Image1 = t;
		t.alpha = 1;
		t.fillMode = "scale";
		t.source = "checkbox_unselect_png";
		return t;
	};
	_proto.labelDisplay_i = function () {
		var t = new eui.Label();
		this.labelDisplay = t;
		t.fontFamily = "Tahoma";
		t.size = 20;
		t.textAlign = "center";
		t.textColor = 0x707070;
		t.verticalAlign = "middle";
		return t;
	};
	return CheckBoxSkin;
})(eui.Skin);generateEUI.paths['resource/skins/components/HScrollBarSkin.exml'] = window.skins.HScrollBarSkin = (function (_super) {
	__extends(HScrollBarSkin, _super);
	function HScrollBarSkin() {
		_super.call(this);
		this.skinParts = ["thumb"];
		
		this.minHeight = 8;
		this.minWidth = 20;
		this.elementsContent = [this.thumb_i()];
	}
	var _proto = HScrollBarSkin.prototype;

	_proto.thumb_i = function () {
		var t = new eui.Image();
		this.thumb = t;
		t.height = 8;
		t.scale9Grid = new egret.Rectangle(3,3,2,2);
		t.source = "roundthumb_png";
		t.verticalCenter = 0;
		t.width = 30;
		return t;
	};
	return HScrollBarSkin;
})(eui.Skin);generateEUI.paths['resource/skins/components/HSliderSkin.exml'] = window.skins.HSliderSkin = (function (_super) {
	__extends(HSliderSkin, _super);
	function HSliderSkin() {
		_super.call(this);
		this.skinParts = ["track","thumb"];
		
		this.minHeight = 8;
		this.minWidth = 20;
		this.elementsContent = [this.track_i(),this.thumb_i()];
	}
	var _proto = HSliderSkin.prototype;

	_proto.track_i = function () {
		var t = new eui.Image();
		this.track = t;
		t.height = 6;
		t.scale9Grid = new egret.Rectangle(1,1,4,4);
		t.source = "track_sb_png";
		t.verticalCenter = 0;
		t.percentWidth = 100;
		return t;
	};
	_proto.thumb_i = function () {
		var t = new eui.Image();
		this.thumb = t;
		t.source = "thumb_png";
		t.verticalCenter = 0;
		return t;
	};
	return HSliderSkin;
})(eui.Skin);generateEUI.paths['resource/skins/components/ItemRendererSkin.exml'] = window.skins.ItemRendererSkin = (function (_super) {
	__extends(ItemRendererSkin, _super);
	function ItemRendererSkin() {
		_super.call(this);
		this.skinParts = ["labelDisplay"];
		
		this.minHeight = 50;
		this.minWidth = 100;
		this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
		this.states = [
			new eui.State ("up",
				[
				])
			,
			new eui.State ("down",
				[
					new eui.SetProperty("_Image1","source","button_down_png")
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("_Image1","alpha",0.5)
				])
		];
		
		eui.Binding.$bindProperties(this, ["hostComponent.data"],[0],this.labelDisplay,"text");
	}
	var _proto = ItemRendererSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		this._Image1 = t;
		t.percentHeight = 100;
		t.scale9Grid = new egret.Rectangle(1,3,8,8);
		t.source = "button_up_png";
		t.percentWidth = 100;
		return t;
	};
	_proto.labelDisplay_i = function () {
		var t = new eui.Label();
		this.labelDisplay = t;
		t.bottom = 8;
		t.fontFamily = "Tahoma";
		t.left = 8;
		t.right = 8;
		t.size = 20;
		t.textAlign = "center";
		t.textColor = 0xFFFFFF;
		t.top = 8;
		t.verticalAlign = "middle";
		return t;
	};
	return ItemRendererSkin;
})(eui.Skin);generateEUI.paths['resource/skins/components/PanelSkin.exml'] = window.skins.PanelSkin = (function (_super) {
	__extends(PanelSkin, _super);
	function PanelSkin() {
		_super.call(this);
		this.skinParts = ["titleDisplay","moveArea","closeButton"];
		
		this.minHeight = 230;
		this.minWidth = 450;
		this.elementsContent = [this._Image1_i(),this.moveArea_i(),this.closeButton_i()];
	}
	var _proto = PanelSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.scale9Grid = new egret.Rectangle(2,2,12,12);
		t.source = "border_png";
		t.top = 0;
		return t;
	};
	_proto.moveArea_i = function () {
		var t = new eui.Group();
		this.moveArea = t;
		t.height = 45;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		t.elementsContent = [this._Image2_i(),this.titleDisplay_i()];
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.source = "header_png";
		t.top = 0;
		return t;
	};
	_proto.titleDisplay_i = function () {
		var t = new eui.Label();
		this.titleDisplay = t;
		t.fontFamily = "Tahoma";
		t.left = 15;
		t.right = 5;
		t.size = 20;
		t.textColor = 0xFFFFFF;
		t.verticalCenter = 0;
		t.wordWrap = false;
		return t;
	};
	_proto.closeButton_i = function () {
		var t = new eui.Button();
		this.closeButton = t;
		t.bottom = 5;
		t.horizontalCenter = 0;
		t.label = "close";
		return t;
	};
	return PanelSkin;
})(eui.Skin);generateEUI.paths['resource/skins/components/ProgressBarSkin.exml'] = window.skins.ProgressBarSkin = (function (_super) {
	__extends(ProgressBarSkin, _super);
	function ProgressBarSkin() {
		_super.call(this);
		this.skinParts = ["thumb","labelDisplay"];
		
		this.minHeight = 18;
		this.minWidth = 30;
		this.elementsContent = [this._Image1_i(),this.thumb_i(),this.labelDisplay_i()];
	}
	var _proto = ProgressBarSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.percentHeight = 100;
		t.scale9Grid = new egret.Rectangle(1,1,4,4);
		t.source = "track_pb_png";
		t.verticalCenter = 0;
		t.percentWidth = 100;
		return t;
	};
	_proto.thumb_i = function () {
		var t = new eui.Image();
		this.thumb = t;
		t.percentHeight = 100;
		t.source = "thumb_pb_png";
		t.percentWidth = 100;
		return t;
	};
	_proto.labelDisplay_i = function () {
		var t = new eui.Label();
		this.labelDisplay = t;
		t.fontFamily = "Tahoma";
		t.horizontalCenter = 0;
		t.size = 15;
		t.textAlign = "center";
		t.textColor = 0x707070;
		t.verticalAlign = "middle";
		t.verticalCenter = 0;
		return t;
	};
	return ProgressBarSkin;
})(eui.Skin);generateEUI.paths['resource/skins/components/RadioButtonSkin.exml'] = window.skins.RadioButtonSkin = (function (_super) {
	__extends(RadioButtonSkin, _super);
	function RadioButtonSkin() {
		_super.call(this);
		this.skinParts = ["labelDisplay"];
		
		this.elementsContent = [this._Group1_i()];
		this.states = [
			new eui.State ("up",
				[
				])
			,
			new eui.State ("down",
				[
					new eui.SetProperty("_Image1","alpha",0.7)
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("_Image1","alpha",0.5)
				])
			,
			new eui.State ("upAndSelected",
				[
					new eui.SetProperty("_Image1","source","radiobutton_select_up_png")
				])
			,
			new eui.State ("downAndSelected",
				[
					new eui.SetProperty("_Image1","source","radiobutton_select_down_png")
				])
			,
			new eui.State ("disabledAndSelected",
				[
					new eui.SetProperty("_Image1","source","radiobutton_select_disabled_png")
				])
		];
	}
	var _proto = RadioButtonSkin.prototype;

	_proto._Group1_i = function () {
		var t = new eui.Group();
		t.percentHeight = 100;
		t.percentWidth = 100;
		t.layout = this._HorizontalLayout1_i();
		t.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
		return t;
	};
	_proto._HorizontalLayout1_i = function () {
		var t = new eui.HorizontalLayout();
		t.verticalAlign = "middle";
		return t;
	};
	_proto._Image1_i = function () {
		var t = new eui.Image();
		this._Image1 = t;
		t.alpha = 1;
		t.fillMode = "scale";
		t.source = "radiobutton_unselect_png";
		return t;
	};
	_proto.labelDisplay_i = function () {
		var t = new eui.Label();
		this.labelDisplay = t;
		t.fontFamily = "Tahoma";
		t.size = 20;
		t.textAlign = "center";
		t.textColor = 0x707070;
		t.verticalAlign = "middle";
		return t;
	};
	return RadioButtonSkin;
})(eui.Skin);generateEUI.paths['resource/skins/components/ScrollerSkin.exml'] = window.skins.ScrollerSkin = (function (_super) {
	__extends(ScrollerSkin, _super);
	function ScrollerSkin() {
		_super.call(this);
		this.skinParts = ["horizontalScrollBar","verticalScrollBar"];
		
		this.minHeight = 20;
		this.minWidth = 20;
		this.elementsContent = [this.horizontalScrollBar_i(),this.verticalScrollBar_i()];
	}
	var _proto = ScrollerSkin.prototype;

	_proto.horizontalScrollBar_i = function () {
		var t = new eui.HScrollBar();
		this.horizontalScrollBar = t;
		t.bottom = 0;
		t.percentWidth = 100;
		return t;
	};
	_proto.verticalScrollBar_i = function () {
		var t = new eui.VScrollBar();
		this.verticalScrollBar = t;
		t.percentHeight = 100;
		t.right = 0;
		return t;
	};
	return ScrollerSkin;
})(eui.Skin);generateEUI.paths['resource/skins/components/TextInputSkin.exml'] = window.skins.TextInputSkin = (function (_super) {
	__extends(TextInputSkin, _super);
	function TextInputSkin() {
		_super.call(this);
		this.skinParts = ["textDisplay","promptDisplay"];
		
		this.minHeight = 40;
		this.minWidth = 300;
		this.elementsContent = [this._Image1_i(),this._Rect1_i(),this.textDisplay_i()];
		this.promptDisplay_i();
		
		this.states = [
			new eui.State ("normal",
				[
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("textDisplay","textColor",0xff0000)
				])
			,
			new eui.State ("normalWithPrompt",
				[
					new eui.AddItems("promptDisplay","",1,"")
				])
			,
			new eui.State ("disabledWithPrompt",
				[
					new eui.AddItems("promptDisplay","",1,"")
				])
		];
	}
	var _proto = TextInputSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.percentHeight = 100;
		t.scale9Grid = new egret.Rectangle(1,3,8,8);
		t.source = "button_up_png";
		t.percentWidth = 100;
		return t;
	};
	_proto._Rect1_i = function () {
		var t = new eui.Rect();
		t.fillColor = 0xffffff;
		t.percentHeight = 100;
		t.percentWidth = 100;
		return t;
	};
	_proto.textDisplay_i = function () {
		var t = new eui.EditableText();
		this.textDisplay = t;
		t.height = 24;
		t.left = "10";
		t.right = "10";
		t.size = 20;
		t.textColor = 0x000000;
		t.verticalCenter = "0";
		t.percentWidth = 100;
		return t;
	};
	_proto.promptDisplay_i = function () {
		var t = new eui.Label();
		this.promptDisplay = t;
		t.height = 24;
		t.left = 10;
		t.right = 10;
		t.size = 20;
		t.textColor = 0xa9a9a9;
		t.touchEnabled = false;
		t.verticalCenter = 0;
		t.percentWidth = 100;
		return t;
	};
	return TextInputSkin;
})(eui.Skin);generateEUI.paths['resource/skins/components/ToggleSwitchSkin.exml'] = window.skins.ToggleSwitchSkin = (function (_super) {
	__extends(ToggleSwitchSkin, _super);
	function ToggleSwitchSkin() {
		_super.call(this);
		this.skinParts = [];
		
		this.elementsContent = [this._Image1_i(),this._Image2_i()];
		this.states = [
			new eui.State ("up",
				[
					new eui.SetProperty("_Image1","source","off_png")
				])
			,
			new eui.State ("down",
				[
					new eui.SetProperty("_Image1","source","off_png")
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("_Image1","source","off_png")
				])
			,
			new eui.State ("upAndSelected",
				[
					new eui.SetProperty("_Image2","horizontalCenter",18)
				])
			,
			new eui.State ("downAndSelected",
				[
					new eui.SetProperty("_Image2","horizontalCenter",18)
				])
			,
			new eui.State ("disabledAndSelected",
				[
					new eui.SetProperty("_Image2","horizontalCenter",18)
				])
		];
	}
	var _proto = ToggleSwitchSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		this._Image1 = t;
		t.source = "on_png";
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		this._Image2 = t;
		t.horizontalCenter = -18;
		t.source = "handle_png";
		t.verticalCenter = 0;
		return t;
	};
	return ToggleSwitchSkin;
})(eui.Skin);generateEUI.paths['resource/skins/components/VScrollBarSkin.exml'] = window.skins.VScrollBarSkin = (function (_super) {
	__extends(VScrollBarSkin, _super);
	function VScrollBarSkin() {
		_super.call(this);
		this.skinParts = ["thumb"];
		
		this.minHeight = 20;
		this.minWidth = 8;
		this.elementsContent = [this.thumb_i()];
	}
	var _proto = VScrollBarSkin.prototype;

	_proto.thumb_i = function () {
		var t = new eui.Image();
		this.thumb = t;
		t.height = 30;
		t.horizontalCenter = 0;
		t.scale9Grid = new egret.Rectangle(3,3,2,2);
		t.source = "roundthumb_png";
		t.width = 8;
		return t;
	};
	return VScrollBarSkin;
})(eui.Skin);generateEUI.paths['resource/skins/components/VSliderSkin.exml'] = window.skins.VSliderSkin = (function (_super) {
	__extends(VSliderSkin, _super);
	function VSliderSkin() {
		_super.call(this);
		this.skinParts = ["track","thumb"];
		
		this.minHeight = 30;
		this.minWidth = 25;
		this.elementsContent = [this.track_i(),this.thumb_i()];
	}
	var _proto = VSliderSkin.prototype;

	_proto.track_i = function () {
		var t = new eui.Image();
		this.track = t;
		t.percentHeight = 100;
		t.horizontalCenter = 0;
		t.scale9Grid = new egret.Rectangle(1,1,4,4);
		t.source = "track_png";
		t.width = 7;
		return t;
	};
	_proto.thumb_i = function () {
		var t = new eui.Image();
		this.thumb = t;
		t.horizontalCenter = 0;
		t.source = "thumb_png";
		return t;
	};
	return VSliderSkin;
})(eui.Skin);generateEUI.paths['resource/skins/LoginServerViewSkin.exml'] = window.skin.LoginServerViewSkin = (function (_super) {
	__extends(LoginServerViewSkin, _super);
	var LoginServerViewSkin$Skin1 = 	(function (_super) {
		__extends(LoginServerViewSkin$Skin1, _super);
		function LoginServerViewSkin$Skin1() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
						new eui.SetProperty("labelDisplay","horizontalCenter",0),
						new eui.SetProperty("labelDisplay","verticalCenter",-2),
						new eui.SetProperty("labelDisplay","size",22),
						new eui.SetProperty("labelDisplay","stroke",1),
						new eui.SetProperty("labelDisplay","textColor",0x907450)
					])
				,
				new eui.State ("down",
					[
						new eui.SetProperty("_Image1","source","btn_login_enter_png"),
						new eui.SetProperty("labelDisplay","verticalCenter",-2),
						new eui.SetProperty("labelDisplay","stroke",1),
						new eui.SetProperty("labelDisplay","size",22),
						new eui.SetProperty("labelDisplay","textColor",0xf7dca5),
						new eui.SetProperty("labelDisplay","strokeColor",0x480302),
						new eui.SetProperty("labelDisplay","horizontalCenter",0)
					])
				,
				new eui.State ("disabled",
					[
						new eui.SetProperty("_Image1","source","btn_login_enter_png"),
						new eui.SetProperty("labelDisplay","textColor",0x66523d)
					])
			];
		}
		var _proto = LoginServerViewSkin$Skin1.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			this._Image1 = t;
			t.percentHeight = 100;
			t.source = "btn_login_enter_png";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.height = 38;
			t.horizontalCenter = 0;
			t.size = 20;
			t.textAlign = "center";
			t.textColor = 0xfcd67d;
			t.verticalAlign = "middle";
			t.verticalCenter = -2;
			t.percentWidth = 100;
			return t;
		};
		return LoginServerViewSkin$Skin1;
	})(eui.Skin);

	var LoginServerViewSkin$Skin2 = 	(function (_super) {
		__extends(LoginServerViewSkin$Skin2, _super);
		function LoginServerViewSkin$Skin2() {
			_super.call(this);
			this.skinParts = ["labelDisplay","iconDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.iconDisplay_i();
			
			this.states = [
				new eui.State ("up",
					[
						new eui.AddItems("iconDisplay","",1,""),
						new eui.SetProperty("_Image1","source","btn_gonggao_png"),
						new eui.SetProperty("labelDisplay","horizontalCenter",0),
						new eui.SetProperty("labelDisplay","verticalCenter",-2),
						new eui.SetProperty("labelDisplay","size",22),
						new eui.SetProperty("labelDisplay","stroke",1),
						new eui.SetProperty("labelDisplay","textColor",0x907450)
					])
				,
				new eui.State ("down",
					[
						new eui.AddItems("iconDisplay","",1,""),
						new eui.SetProperty("_Image1","source","btn_gonggao_png"),
						new eui.SetProperty("labelDisplay","verticalCenter",-2),
						new eui.SetProperty("labelDisplay","stroke",1),
						new eui.SetProperty("labelDisplay","size",22),
						new eui.SetProperty("labelDisplay","textColor",0xf7dca5),
						new eui.SetProperty("labelDisplay","strokeColor",0x480302),
						new eui.SetProperty("labelDisplay","horizontalCenter",0)
					])
				,
				new eui.State ("disabled",
					[
						new eui.SetProperty("_Image1","alpha",0.5),
						new eui.SetProperty("_Image1","source","btn_gonggao_png"),
						new eui.SetProperty("labelDisplay","textColor",0x66523d)
					])
			];
		}
		var _proto = LoginServerViewSkin$Skin2.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			this._Image1 = t;
			t.percentHeight = 100;
			t.source = "btn_gonggao_png";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.height = 38;
			t.horizontalCenter = 0;
			t.size = 20;
			t.textAlign = "center";
			t.textColor = 0xfcd67d;
			t.verticalAlign = "middle";
			t.verticalCenter = -2;
			t.percentWidth = 100;
			return t;
		};
		_proto.iconDisplay_i = function () {
			var t = new eui.Image();
			this.iconDisplay = t;
			t.left = 0;
			t.source = "img_warn_png";
			t.top = 0;
			t.visible = false;
			return t;
		};
		return LoginServerViewSkin$Skin2;
	})(eui.Skin);

	function LoginServerViewSkin() {
		_super.call(this);
		this.skinParts = ["labChange","labSeverName","bntEnter","btnNotice","labBanSu"];
		
		this.height = 1136;
		this.width = 640;
		this.elementsContent = [this._Image1_i(),this._Image2_i(),this.labChange_i(),this.labSeverName_i(),this.bntEnter_i(),this.btnNotice_i(),this.labBanSu_i()];
	}
	var _proto = LoginServerViewSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.height = 1294;
		t.horizontalCenter = 0;
		t.source = "img_loding_jpg";
		t.width = 729;
		t.y = -158;
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		t.horizontalCenter = 0;
		t.source = "img_selet_sever_back_png";
		t.y = 754;
		return t;
	};
	_proto.labChange_i = function () {
		var t = new eui.Label();
		this.labChange = t;
		t.size = 20;
		t.text = "点击换区";
		t.textColor = 0x39890d;
		t.x = 390;
		t.y = 772;
		return t;
	};
	_proto.labSeverName_i = function () {
		var t = new eui.Label();
		this.labSeverName = t;
		t.size = 20;
		t.text = "无";
		t.textColor = 0x8e8e8e;
		t.x = 160;
		t.y = 772;
		return t;
	};
	_proto.bntEnter_i = function () {
		var t = new eui.Button();
		this.bntEnter = t;
		t.anchorOffsetX = 118;
		t.anchorOffsetY = 33;
		t.height = 65;
		t.horizontalCenter = 0;
		t.label = "";
		t.width = 235;
		t.y = 870;
		t.skinName = LoginServerViewSkin$Skin1;
		return t;
	};
	_proto.btnNotice_i = function () {
		var t = new eui.Button();
		this.btnNotice = t;
		t.anchorOffsetX = 66;
		t.anchorOffsetY = 45;
		t.height = 25;
		t.label = "";
		t.width = 73;
		t.x = 620;
		t.y = 107;
		t.skinName = LoginServerViewSkin$Skin2;
		return t;
	};
	_proto.labBanSu_i = function () {
		var t = new eui.Label();
		this.labBanSu = t;
		t.anchorOffsetX = 0;
		t.horizontalCenter = 0;
		t.lineSpacing = 10;
		t.size = 16;
		t.text = "";
		t.textColor = 0x9f9f9f;
		t.width = 600;
		t.y = 930;
		return t;
	};
	return LoginServerViewSkin;
})(eui.Skin);generateEUI.paths['resource/skins/LoginViewSkin.exml'] = window.skin.LoginViewSkin = (function (_super) {
	__extends(LoginViewSkin, _super);
	var LoginViewSkin$Skin3 = 	(function (_super) {
		__extends(LoginViewSkin$Skin3, _super);
		function LoginViewSkin$Skin3() {
			_super.call(this);
			this.skinParts = ["textDisplay","promptDisplay"];
			
			this.minHeight = 40;
			this.minWidth = 300;
			this.elementsContent = [this._Rect1_i(),this.textDisplay_i()];
			this.promptDisplay_i();
			
			this.states = [
				new eui.State ("normal",
					[
					])
				,
				new eui.State ("disabled",
					[
						new eui.SetProperty("textDisplay","textColor",0xff0000)
					])
				,
				new eui.State ("normalWithPrompt",
					[
						new eui.AddItems("promptDisplay","",1,"")
					])
				,
				new eui.State ("disabledWithPrompt",
					[
						new eui.AddItems("promptDisplay","",1,"")
					])
			];
		}
		var _proto = LoginViewSkin$Skin3.prototype;

		_proto._Rect1_i = function () {
			var t = new eui.Rect();
			t.anchorOffsetY = 0;
			t.fillAlpha = 0.7;
			t.fillColor = 0x000000;
			t.height = 49;
			t.percentWidth = 100;
			return t;
		};
		_proto.textDisplay_i = function () {
			var t = new eui.EditableText();
			this.textDisplay = t;
			t.height = 24;
			t.left = "10";
			t.right = "10";
			t.size = 20;
			t.textColor = 0xddc235;
			t.verticalCenter = "0";
			t.percentWidth = 100;
			return t;
		};
		_proto.promptDisplay_i = function () {
			var t = new eui.Label();
			this.promptDisplay = t;
			t.height = 24;
			t.horizontalCenter = 0;
			t.left = 10;
			t.right = 10;
			t.size = 20;
			t.textColor = 0xa9a9a9;
			t.touchEnabled = false;
			t.verticalCenter = 0;
			t.percentWidth = 100;
			return t;
		};
		return LoginViewSkin$Skin3;
	})(eui.Skin);

	var LoginViewSkin$Skin4 = 	(function (_super) {
		__extends(LoginViewSkin$Skin4, _super);
		function LoginViewSkin$Skin4() {
			_super.call(this);
			this.skinParts = ["labelDisplay","iconDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.iconDisplay_i();
			
			this.states = [
				new eui.State ("up",
					[
						new eui.AddItems("iconDisplay","",1,""),
						new eui.SetProperty("_Image1","source","btn_red_png"),
						new eui.SetProperty("labelDisplay","horizontalCenter",0),
						new eui.SetProperty("labelDisplay","verticalCenter",-2),
						new eui.SetProperty("labelDisplay","size",22),
						new eui.SetProperty("labelDisplay","stroke",1),
						new eui.SetProperty("labelDisplay","textColor",0x907450)
					])
				,
				new eui.State ("down",
					[
						new eui.AddItems("iconDisplay","",1,""),
						new eui.SetProperty("_Image1","source","btn_red_png"),
						new eui.SetProperty("labelDisplay","verticalCenter",-2),
						new eui.SetProperty("labelDisplay","stroke",1),
						new eui.SetProperty("labelDisplay","size",22),
						new eui.SetProperty("labelDisplay","textColor",0xf7dca5),
						new eui.SetProperty("labelDisplay","strokeColor",0x480302),
						new eui.SetProperty("labelDisplay","horizontalCenter",0)
					])
				,
				new eui.State ("disabled",
					[
						new eui.SetProperty("_Image1","alpha",0.5),
						new eui.SetProperty("_Image1","source","btn_red_png"),
						new eui.SetProperty("labelDisplay","textColor",0x66523d)
					])
			];
		}
		var _proto = LoginViewSkin$Skin4.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			this._Image1 = t;
			t.percentHeight = 100;
			t.scale9Grid = new egret.Rectangle(21,22,11,16);
			t.source = "btn_red_png";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.height = 38;
			t.horizontalCenter = 0;
			t.size = 20;
			t.textAlign = "center";
			t.textColor = 0xfcd67d;
			t.verticalAlign = "middle";
			t.verticalCenter = -2;
			t.percentWidth = 100;
			return t;
		};
		_proto.iconDisplay_i = function () {
			var t = new eui.Image();
			this.iconDisplay = t;
			t.left = 0;
			t.source = "img_warn_png";
			t.top = 0;
			t.visible = false;
			return t;
		};
		return LoginViewSkin$Skin4;
	})(eui.Skin);

	function LoginViewSkin() {
		_super.call(this);
		this.skinParts = ["input","btnLogin"];
		
		this.height = 300;
		this.width = 400;
		this.elementsContent = [this._Image1_i(),this.input_i(),this._Label1_i(),this.btnLogin_i()];
	}
	var _proto = LoginViewSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.height = 300;
		t.source = "create_btn_red_up_png";
		t.width = 400;
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto.input_i = function () {
		var t = new eui.TextInput();
		this.input = t;
		t.horizontalCenter = 0;
		t.y = 119;
		t.skinName = LoginViewSkin$Skin3;
		return t;
	};
	_proto._Label1_i = function () {
		var t = new eui.Label();
		t.bold = true;
		t.horizontalCenter = 1.5;
		t.size = 20;
		t.text = "请输入用户名";
		t.y = 86;
		return t;
	};
	_proto.btnLogin_i = function () {
		var t = new eui.Button();
		this.btnLogin = t;
		t.anchorOffsetX = 83;
		t.anchorOffsetY = 34;
		t.height = 69;
		t.label = "登录";
		t.width = 166;
		t.x = 200;
		t.y = 230;
		t.skinName = LoginViewSkin$Skin4;
		return t;
	};
	return LoginViewSkin;
})(eui.Skin);generateEUI.paths['resource/skins/NoticeViewSkin.exml'] = window.skin.NoticeViewSkin = (function (_super) {
	__extends(NoticeViewSkin, _super);
	var NoticeViewSkin$Skin5 = 	(function (_super) {
		__extends(NoticeViewSkin$Skin5, _super);
		function NoticeViewSkin$Skin5() {
			_super.call(this);
			this.skinParts = ["labelDisplay","iconDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.iconDisplay_i();
			
			this.states = [
				new eui.State ("up",
					[
						new eui.AddItems("iconDisplay","",1,""),
						new eui.SetProperty("_Image1","source","btn_red_png"),
						new eui.SetProperty("labelDisplay","horizontalCenter",0),
						new eui.SetProperty("labelDisplay","verticalCenter",-2),
						new eui.SetProperty("labelDisplay","size",22),
						new eui.SetProperty("labelDisplay","stroke",1),
						new eui.SetProperty("labelDisplay","textColor",0x907450)
					])
				,
				new eui.State ("down",
					[
						new eui.AddItems("iconDisplay","",1,""),
						new eui.SetProperty("_Image1","source","btn_red_png"),
						new eui.SetProperty("labelDisplay","verticalCenter",-2),
						new eui.SetProperty("labelDisplay","stroke",1),
						new eui.SetProperty("labelDisplay","size",22),
						new eui.SetProperty("labelDisplay","textColor",0xf7dca5),
						new eui.SetProperty("labelDisplay","strokeColor",0x480302),
						new eui.SetProperty("labelDisplay","horizontalCenter",0)
					])
				,
				new eui.State ("disabled",
					[
						new eui.SetProperty("_Image1","alpha",0.5),
						new eui.SetProperty("_Image1","source","btn_red_png"),
						new eui.SetProperty("labelDisplay","textColor",0x66523d)
					])
			];
		}
		var _proto = NoticeViewSkin$Skin5.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			this._Image1 = t;
			t.percentHeight = 100;
			t.scale9Grid = new egret.Rectangle(21,22,11,16);
			t.source = "btn_red_png";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.height = 38;
			t.horizontalCenter = 0;
			t.size = 20;
			t.textAlign = "center";
			t.textColor = 0xfcd67d;
			t.verticalAlign = "middle";
			t.verticalCenter = -2;
			t.percentWidth = 100;
			return t;
		};
		_proto.iconDisplay_i = function () {
			var t = new eui.Image();
			this.iconDisplay = t;
			t.left = 0;
			t.source = "img_warn_png";
			t.top = 0;
			t.visible = false;
			return t;
		};
		return NoticeViewSkin$Skin5;
	})(eui.Skin);

	function NoticeViewSkin() {
		_super.call(this);
		this.skinParts = ["labContent","btnClose"];
		
		this.height = 861;
		this.width = 590;
		this.elementsContent = [this._Image1_i(),this._Image2_i(),this.labContent_i(),this.btnClose_i()];
	}
	var _proto = NoticeViewSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 827;
		t.horizontalCenter = 0;
		t.scale9Grid = new egret.Rectangle(21,26,29,54);
		t.source = "img_offlin_bg_png";
		t.width = 580;
		t.x = 0;
		t.y = 32;
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		t.source = "img_login_notice_png";
		t.x = 257;
		t.y = 24;
		return t;
	};
	_proto.labContent_i = function () {
		var t = new eui.Label();
		this.labContent = t;
		t.height = 690;
		t.lineSpacing = 6;
		t.scaleX = 1;
		t.scaleY = 1;
		t.size = 20;
		t.text = "";
		t.textColor = 0xC6B59E;
		t.touchEnabled = false;
		t.verticalAlign = "middle";
		t.width = 524;
		t.x = 33;
		t.y = 71;
		return t;
	};
	_proto.btnClose_i = function () {
		var t = new eui.Button();
		this.btnClose = t;
		t.anchorOffsetX = 73;
		t.anchorOffsetY = 32;
		t.height = 62;
		t.horizontalCenter = 0;
		t.label = "关闭";
		t.width = 146;
		t.y = 804;
		t.skinName = NoticeViewSkin$Skin5;
		return t;
	};
	return NoticeViewSkin;
})(eui.Skin);generateEUI.paths['resource/skins/SelectServerListCellSkin.exml'] = window.skin.SelectServerListCellSkin = (function (_super) {
	__extends(SelectServerListCellSkin, _super);
	function SelectServerListCellSkin() {
		_super.call(this);
		this.skinParts = ["btnStatus","labelName","imgState","imgLay"];
		
		this.height = 64;
		this.width = 273;
		this.elementsContent = [this.btnStatus_i(),this.labelName_i(),this.imgState_i(),this.imgLay_i()];
	}
	var _proto = SelectServerListCellSkin.prototype;

	_proto.btnStatus_i = function () {
		var t = new eui.Image();
		this.btnStatus = t;
		t.source = "create_btn_yellow_png";
		return t;
	};
	_proto.labelName_i = function () {
		var t = new eui.Label();
		this.labelName = t;
		t.height = 38;
		t.horizontalCenter = 0;
		t.size = 18;
		t.text = "";
		t.textAlign = "center";
		t.textColor = 0xffe5ca;
		t.verticalAlign = "middle";
		t.verticalCenter = 0;
		t.percentWidth = 100;
		return t;
	};
	_proto.imgState_i = function () {
		var t = new eui.Image();
		this.imgState = t;
		t.source = "img_login_hot_png";
		t.x = 215;
		return t;
	};
	_proto.imgLay_i = function () {
		var t = new eui.Image();
		this.imgLay = t;
		t.source = "img_login_lay_png";
		t.x = 229;
		t.y = 41;
		return t;
	};
	return SelectServerListCellSkin;
})(eui.Skin);generateEUI.paths['resource/skins/ServerListViewSkin.exml'] = window.skin.ServerListViewSkin = (function (_super) {
	__extends(ServerListViewSkin, _super);
	var ServerListViewSkin$Skin6 = 	(function (_super) {
		__extends(ServerListViewSkin$Skin6, _super);
		function ServerListViewSkin$Skin6() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
						new eui.SetProperty("labelDisplay","size",18),
						new eui.SetProperty("labelDisplay","stroke",1),
						new eui.SetProperty("labelDisplay","textColor",0x64524b)
					])
				,
				new eui.State ("down",
					[
						new eui.SetProperty("_Image1","source","create_btn_red_down_png"),
						new eui.SetProperty("labelDisplay","stroke",1),
						new eui.SetProperty("labelDisplay","size",18),
						new eui.SetProperty("labelDisplay","strokeColor",0x480302),
						new eui.SetProperty("labelDisplay","textColor",0xffe5ca)
					])
				,
				new eui.State ("disabled",
					[
						new eui.SetProperty("_Image1","alpha",0.5)
					])
			];
			
			eui.Binding.$bindProperties(this, ["hostComponent.data"],[0],this.labelDisplay,"text");
		}
		var _proto = ServerListViewSkin$Skin6.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			this._Image1 = t;
			t.source = "create_btn_red_up_png";
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.height = 38;
			t.horizontalCenter = 0;
			t.size = 18;
			t.textAlign = "center";
			t.textColor = 0xffe5ca;
			t.verticalAlign = "middle";
			t.verticalCenter = -2;
			t.percentWidth = 100;
			return t;
		};
		return ServerListViewSkin$Skin6;
	})(eui.Skin);

	function ServerListViewSkin() {
		_super.call(this);
		this.skinParts = ["listSection","listSever","imgEmty"];
		
		this.height = 646;
		this.width = 570;
		this.elementsContent = [this._Image1_i(),this._Image2_i(),this._Image3_i(),this._Scroller1_i(),this._Scroller2_i(),this.imgEmty_i()];
	}
	var _proto = ServerListViewSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.percentHeight = 94;
		t.horizontalCenter = 0;
		t.scale9Grid = new egret.Rectangle(40,52,60,9);
		t.source = "create_img_title_png";
		t.y = 0;
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		t.height = 510;
		t.scale9Grid = new egret.Rectangle(4,4,4,4);
		t.source = "img_create_list_back_png";
		t.width = 288;
		t.x = 261;
		t.y = 61;
		return t;
	};
	_proto._Image3_i = function () {
		var t = new eui.Image();
		t.height = 510;
		t.scale9Grid = new egret.Rectangle(4,4,4,4);
		t.source = "img_create_list_back_png";
		t.width = 214;
		t.x = 32;
		t.y = 61;
		return t;
	};
	_proto._Scroller1_i = function () {
		var t = new eui.Scroller();
		t.height = 495;
		t.width = 195;
		t.x = 42;
		t.y = 68;
		t.viewport = this.listSection_i();
		return t;
	};
	_proto.listSection_i = function () {
		var t = new eui.List();
		this.listSection = t;
		t.itemRendererSkinName = ServerListViewSkin$Skin6;
		t.layout = this._VerticalLayout1_i();
		return t;
	};
	_proto._VerticalLayout1_i = function () {
		var t = new eui.VerticalLayout();
		t.gap = 6;
		return t;
	};
	_proto._Scroller2_i = function () {
		var t = new eui.Scroller();
		t.height = 492;
		t.width = 273;
		t.x = 267;
		t.y = 68;
		t.viewport = this.listSever_i();
		return t;
	};
	_proto.listSever_i = function () {
		var t = new eui.List();
		this.listSever = t;
		t.scaleX = 1;
		t.scaleY = 1;
		t.layout = this._VerticalLayout2_i();
		return t;
	};
	_proto._VerticalLayout2_i = function () {
		var t = new eui.VerticalLayout();
		t.gap = 6;
		return t;
	};
	_proto.imgEmty_i = function () {
		var t = new eui.Image();
		this.imgEmty = t;
		t.anchorOffsetX = 143;
		t.anchorOffsetY = 14;
		t.horizontalCenter = 0;
		t.source = "closetip_png";
		t.y = 623;
		return t;
	};
	return ServerListViewSkin;
})(eui.Skin);generateEUI.paths['resource/skins/ShellLoadingSkin.exml'] = window.skin.ShellLoadingSkin = (function (_super) {
	__extends(ShellLoadingSkin, _super);
	function ShellLoadingSkin() {
		_super.call(this);
		this.skinParts = ["logo","bar","progress","tip"];
		
		this.height = 300;
		this.width = 400;
		this.elementsContent = [this.logo_i(),this.bar_i(),this.progress_i(),this.tip_i()];
	}
	var _proto = ShellLoadingSkin.prototype;

	_proto.logo_i = function () {
		var t = new eui.Image();
		this.logo = t;
		t.height = 117;
		t.horizontalCenter = 0;
		t.verticalCenter = 0;
		t.width = 250;
		return t;
	};
	_proto.bar_i = function () {
		var t = new eui.Image();
		this.bar = t;
		t.anchorOffsetX = 0;
		t.horizontalCenter = 0;
		t.scale9Grid = new egret.Rectangle(4,0,19,9);
		t.source = "img_lodingProgressSmallBg_png";
		t.verticalCenter = 136;
		t.width = 214;
		return t;
	};
	_proto.progress_i = function () {
		var t = new eui.Image();
		this.progress = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.scale9Grid = new egret.Rectangle(2,0,8,3);
		t.source = "img_lodingSmallProgress_png";
		t.verticalCenter = 136.5;
		t.width = 210;
		t.x = 95;
		return t;
	};
	_proto.tip_i = function () {
		var t = new eui.Label();
		this.tip = t;
		t.horizontalCenter = 0;
		t.size = 14;
		t.stroke = 2;
		t.strokeColor = 0x000000;
		t.text = "AA";
		t.textAlign = "center";
		t.textColor = 0xbfbdbd;
		t.verticalCenter = 124;
		t.width = 355;
		return t;
	};
	return ShellLoadingSkin;
})(eui.Skin);