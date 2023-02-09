
class BaseTheme {

    private _backgroundColor: string = "";
    private _textColor: string = "";

    constructor() {
    }

    get backgroundColor(): string {
        return this._backgroundColor;
    }

    set backgroundColor(value: string) {
        this._backgroundColor = value;
    }

    get textColor(): string {
        return this._textColor;
    }

    set textColor(value: string) {
        this._textColor = value;
    }
}


class BlackTheme extends BaseTheme {

    constructor() {
        super();

        this.backgroundColor = "#222";
        this.textColor = "#e6e6e6";
    }
}

export {BlackTheme};
