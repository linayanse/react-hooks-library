export var FieldKind;
(function (FieldKind) {
    // 展示
    FieldKind[FieldKind["Presentation"] = 1] = "Presentation";
    // 日期
    FieldKind[FieldKind["Date"] = 2] = "Date";
    // 数值
    FieldKind[FieldKind["Numeric"] = 10] = "Numeric";
    // 货币
    FieldKind[FieldKind["Currency"] = 11] = "Currency";
})(FieldKind || (FieldKind = {}));
export var ChartType;
(function (ChartType) {
    ChartType[ChartType["LINE"] = 0] = "LINE";
    ChartType[ChartType["BAR"] = 1] = "BAR";
})(ChartType || (ChartType = {}));
