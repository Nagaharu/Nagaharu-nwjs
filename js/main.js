/*
Nagaharu DTP v1.0 (Dev) - main.js
(c)2016 Sora Arakawa. all rights reserved.
*/

var EditText,EditTextArray,EditTextData,EditTextClass; //文章シート関連
var FileName; //ファイル関連
var NewTextID=0;
var PaperSize="A4";
var fs = require('fs');

jQuery(function(){
    // A4タテサイズの印刷CSSを設定
    $("#PaperCSS").attr("href","css/paper/"+PaperSize+".css");
    // テキストエリアEditTxDataが編集された時に発火するイベント
    $("#EditTxData").each(function(){
        $(this).bind("keyup", CheckTxData(this));
    });
} );

// ドラッグ＆ドロップ機能の初期化
function StartDragDrop(){
    // 文章シートのドラッグ
    jQuery('.Nghr_TextBox').draggable({
        containment: 'parent',
        scroll: false,
        start: function(event, ui) {
            // 編集する文章シートのIDを取得
            EditTextData=$(this).attr("id");
            EditTextClass
            var ChkImage=$("#"+EditTextData).html().indexOf("<img");
            if(ChkImage > -1){
                $("#TextSheet").hide();
                $("#ShapeSheet").hide();
                $("#ImgSheet").show();
            }else{
                var ChkShape=$(this).attr("class").indexOf("Shape");
                if(ChkShape>-1){
                    $("#TextSheet").hide();
                    $("#ImgSheet").hide();
                    $("#ShapeSheet").show();
                    $("#ShapeCSS").val($("#"+EditTextData).css("border-radius"));
                    $("#ShapeBGColor").val($("#"+EditTextData).css("background-color"));
                }else{
                    $("#TextSheet").show();
                    $("#ImgSheet").hide();
                    $("#ShapeSheet").hide();
                    // テキストエリアに文章シートの内容を表示
                    EditText=$("#"+EditTextData).text();
                    $("#EditTxData").val(EditText);

                    // 文章シートの行間を取得
                    var TxLineHeight=$(this).css("line-height");
                    TxLineHeight=parseInt(TxLineHeight);
                    $("#TextParam1").val(TxLineHeight);

                    // 文章シートの字間を取得
                    var TxLineWidth=$(this).css("letter-spacing");
                    TxLineWidth=parseInt(TxLineWidth);
                    $("#TextParam2").val(TxLineWidth);

                    // 文章シートのフォントサイズを取得
                    var TxFontSize=$(this).css("font-size");
                    TxFontSize=parseInt(TxFontSize);
                    $("#TextParam3").val(TxFontSize);

                    // 文章シートのフォントを取得
                    /*
                    書体だけはシート内のspanにCSSを書き込んでいるので、
                    そこからCSSを取得します。
                    */
                    var TxFontFamily=$("#"+EditTextData+" span").css("font-family");
                    $("#TextFontFamily").val(TxFontFamily);

                    // 文章シートのフォント色を取得
                    var TxFontCl=$(this).css("color");
                    $("#TextFontColor").val(TxFontCl);
                }
            }
            
	    }
    });
    jQuery('.Nghr_TextBox').resizable({
        resize: function(event, ui) {
            EditImgData=$(this).attr("id");
            $("#"+EditImgData+" img").width($("#"+EditImgData).width());
        }
    });
}

// ドキュメントの新規作成（ダイアログ表示）
function NewPage(){
    $("#NoEdit").show();
    $("#NewPageDiag").show();
    $("#DocPaperType").val("A4");
}

// ドキュメントの新規作成を実行
function DoNewPage(){
    $("#TextSheet").hide();
    $("#ImgSheet").hide();
    // 変数の初期化
    NewTextID=0;
    PaperSize="A4";
    FileName="";
    document.title="Nagaharu DTP";
    // 入力欄の初期化
    $("#Paper").empty();
    $("#EditTxData").val("");
    $("#TextParam1").val(20);
    $("#TextParam2").val(0);
    $("#TextParam3").val(14);
    $("#TextFontFamily").val("MPlus");
    $("#TextFontColor").val("000000");
    $("#NewPageDiag").hide();
    $("#NoEdit").hide();
}

// ドキュメントを開く（ダイアログ表示）
function DocLoad(){
    $("#DataLoad").click();
}

// ドキュメントを開く（実際の処理）
function StartLoad(){
    FileName=$("#DataLoad").val();
    var NghrData=fs.readFileSync(FileName);
    var NghrHTML=JSON.parse(NghrData);
    // 変数を初期化
    NewTextID=parseInt(NghrHTML[0]);
    PaperSize=NghrHTML[1];
    $("#DocPaperType").val(PaperSize);
    // 内容を反映
    $("#Paper").html(""+NghrHTML[3]);
    // ドラッグ操作を有効化
    StartDragDrop();
    document.title = FileName+" - Nagaharu DTP";
}

// ドキュメントの保存（ダイアログ表示）
function DocSaveAs(){
    $("#DataSaveAs").click();
}

// ドキュメントの上書き保存
function DocSave(){
    if(FileName==undefined){
        DocSaveAs();
    }else{
        DocSave2();
    }
}

// 保存共通処理（上書き／別名）
function DocSave2(){
    jQuery('.Nghr_TextBox').resizable("destroy");
    var strData = new Array;
    strData[0]=""+NewTextID
    strData[1]=PaperSize;
    strData[2]="Nagaharu Document";
    strData[3]=$("#Paper").html();
    var strData = JSON.stringify(strData);
    fs.writeFile(FileName, strData, function(err) {
	    if(err) {
	        alert("保存に失敗しました。");
	    }else{
	    	document.title = FileName+" - Nagaharu DTP";
	    }
	});
    jQuery('.Nghr_TextBox').resizable();
}

// ドキュメントの保存（実際の処理）
function StartSaveAs(){
    FileName=$("#DataSaveAs").val();
    var num = FileName.indexOf(".ngr",0);
    if (num == -1) FileName=FileName+".ngr";
    DocSave2();
}

// ドキュメントの設定
function DocSetup(){
    $("#NoEdit").show();
    $("#DocSetupDiag").show();
    $("#DocPaperType").val(PaperSize);
}

// ドキュメントの設定を保存
function SaveDocSetup(){
    PaperSize=$("#DocPaperType").val();
    $("#DocSetupDiag").hide();
    $("#NoEdit").hide();
    $("#PaperCSS").attr("href","css/paper/"+PaperSize+".css");
}

// ダイアログをキャンセル
function CancelDialog(){
    $(".Dialog").hide();
    $("#NoEdit").hide();
}

// ドキュメントの印刷
function DocPrint(){
    if(NewTextID==0){
        $("#NoEdit").show();
        $("#NoPrintDiag").show();
    }else{
        $("#Paper").printThis();
    }
}

// 出力ダイアログ表示
function Export(){
    $("#NoEdit").show();
    $("#ExportDiag").show();
}

// HTMLで出力
function ExportHTML(){
    var WebFileName=$("#ExportWeb").val();
    var num = WebFileName.indexOf(".html",0);
    if (num == -1) WebFileName=WebFileName+".html";
    var HTMLData='<html><head><title>Nagaharu DTP</title><meta charset="utf-8"><style>.ShapeSquare{width: 100%;height: 100%;border-radius:0%;background: black;}.Nghr_TextBox{position:relative;}</style></head><body>';
    HTMLData+=$("#Paper").html();
    HTMLData+="</body></html>";
    fs.writeFile(WebFileName, HTMLData, function(err) {
	    if(err) {
	        alert("出力に失敗しました。");
	    }
	});
    $("#ExportDiag").hide();
    $("#NoEdit").hide();
}

// PNGで出力
function ExportPNG(){
    var PictureFileName=$("#ExportPicture").val();
    var num = PictureFileName.indexOf(".png",0);
    if (num == -1) PictureFileName=PictureFileName+".png";
    // 画像に映らないようドラッグ枠を消す
    jQuery('.Nghr_TextBox').draggable("destroy");
    jQuery('.Nghr_TextBox').resizable("destroy");
    $('.Nghr_TextBox').css("border","none");
    // 用紙divをPNGに変換
    var dmy = document.getElementById("Paper");
    var pw = $("#Paper").width;
    var ph = $("#Paper").height;
    html2canvas(dmy).then(function(canvas){
        var dataurl = canvas.toDataURL('image/png');
        dataurl = dataurl.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
	    fs.writeFile(PictureFileName, dataurl, 'base64', function(err) {
	        console.log(err);
	    });
        StartDragDrop();
        $('.Nghr_TextBox').css("border","dotted 1px black");
        $("#ExportDiag").hide();
        $("#NoEdit").hide();
    }).catch(function(err){
        alert("出力に失敗しました。");
    });
}

// 文字シートの追加
function AddText(){
    $("#Paper").append('<span class="Nghr_TextBox" style="position:absolute" id="ts'+NewTextID+'"><span id="tx'+NewTextID+'">新規文字シート</span></span>');
    NewTextID++;
    StartDragDrop();
}

// 行間の設定
function ChangeLineHeight(){
    var TxLineHeight=$("#TextParam1").val();
    $("#"+EditTextData).css("line-height",TxLineHeight+"px");
}

// 文字間の設定
function ChangeLineWidth(){
    var TxLineWidth=$("#TextParam2").val();
    $("#"+EditTextData).css("letter-spacing",TxLineWidth+"px");
}

// 文字サイズの設定
function ChangeFontSize(){
    var TxFontSize=$("#TextParam3").val();
    $("#"+EditTextData).css("font-size",TxFontSize+"px");
}

// 文字書体の設定
function ChangeFontFamily(){
    var TxFontFamily=$("#TextFontFamily").val();
    $("#"+EditTextData+" span").css("font-family",""+TxFontFamily);
}

// 文字色の設定
function ChangeFontColor(){
    var TxFontColor=$("#TextFontColor").val();
    $("#"+EditTextData).css("color","#"+TxFontColor);
}

// 文章の左揃え
function ChangeFontLeft(){
    $("#"+EditTextData).css("justify-content","flex-start");
    $("#"+EditTextData).css("text-align","left");
}

// 文章の中央揃え
function ChangeFontCenter(){
    $("#"+EditTextData).css("justify-content","center");
    $("#"+EditTextData).css("text-align","center");
}

// 文章の右揃え
function ChangeFontRight(){
    $("#"+EditTextData).css("justify-content","flex-end");
    $("#"+EditTextData).css("text-align","right");
}

// 文字を太字にする
function ChangeFontBold(){
    var TxFontBold=$("#"+EditTextData).css("font-weight");
    if(TxFontBold=="bold"){
        $("#"+EditTextData).css("font-weight","normal");
    }else{
        $("#"+EditTextData).css("font-weight","bold");
    }
}

// 文字を斜体にする
function ChangeFontItalic(){
    var TxFontItalic=$("#"+EditTextData).css("font-style");
    if(TxFontItalic=="italic"){
        $("#"+EditTextData).css("font-style","normal");
    }else{
        $("#"+EditTextData).css("font-style","italic");
    }
}

// 文字に下線を引く
function ChangeFontUnderLine(){
    var TxFontUnderLine=$("#"+EditTextData).css("text-decoration");
    if(TxFontUnderLine=="underline"){
        $("#"+EditTextData).css("text-decoration","none");
    }else{
        $("#"+EditTextData).css("text-decoration","underline");
    }
}

// 文字を縦書きにする
function ChangeFontWritingMode(){
    var TxFontWritingMode=$("#"+EditTextData).css("writing-mode");
    if(TxFontWritingMode=="vertical-rl"){
        $("#"+EditTextData).css("writing-mode","horizontal-tb");
    }else{
        $("#"+EditTextData).css("writing-mode","tb-rl");
    }
}

//文字シートの削除ダイアログ
function DeleteSheet(){
    $("#NoEdit").show();
    $("#ConfirmTxDel").show();
}

//文字シートの削除を実行
function DoDeleteSheet(){
    $("#"+EditTextData).remove();
    $("#ConfirmTxDel").hide();
    $("#NoEdit").hide();
}

// テキストエリアの編集時に発火するイベント
function CheckTxData(elm){
    var v, old = elm.value;
    return function(){
        if(old != (v=elm.value)){
            old = v;
            str = $(this).val().replace(/\n/g,"<br>\n");
            $("#"+EditTextData+" span").html(str);
        }
    }
}

// 画像シートの追加
function AddImage(){
    $("#Paper").append('<span class="Nghr_TextBox" style="position:absolute" id="ts'+NewTextID+'"><img src="img/No_Image.png"></span>');
    NewTextID++;
    StartDragDrop();
}

// 画像シートの画像変更処理
function ChgImage(){
	var pic_canvas = document.getElementById('LoadPicCanvas');
	var ctx = pic_canvas.getContext('2d');
	img = new Image();
	img.src = $("#ImageFile").val();
	img.onload = function() {
        var dstWidth, dstHeight;
        var MIN_SIZE=640;
        if (this.width > this.height) {
            dstWidth = MIN_SIZE;
            dstHeight = this.height * MIN_SIZE / this.width;
        } else {
            dstHeight = MIN_SIZE;
            dstWidth = this.width * MIN_SIZE / this.height;
        }
	    pic_canvas.width = dstWidth;
	    pic_canvas.height = dstHeight;
        ctx.drawImage(this, 0, 0, this.width, this.height, 0, 0, dstWidth, dstHeight);
        var img_src = pic_canvas.toDataURL();
        $("#"+EditTextData+" img").attr("src",img_src);
    };
}

// 図形シートの追加
function AddShape(){
    $("#Paper").append('<span class="ShapeSquare Nghr_TextBox" style="position:absolute;width:128px;height:128px;" id="ts'+NewTextID+'"></span>');
    NewTextID++;
    StartDragDrop();
}

// 図形の変更
function ChangeShapeCSS(){
    $("#"+EditTextData).css("border-radius",$("#ShapeCSS").val());
}

// 図形の背景色変更
function ChangeShapeBG(){
    $("#"+EditTextData).css("background-color","#"+$("#ShapeBGColor").val());
}