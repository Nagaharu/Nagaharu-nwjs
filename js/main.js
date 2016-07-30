/*
Nagaharu DTP v1.0 (Dev) - main.js
(c)2016 Sora Arkw all rights reserved.


*/

var EditText,EditTextArray,EditTextData,EditTextClass; //文章シート関連
var FileName; //ファイル関連
var NewTextID=0;
var fs = require('fs');

jQuery(function(){
    $("#PaperCSS").html('<link rel="stylesheet" href="css/paper/A4.css">');
    // テキストエリアEditTxDataが編集された時に発火するイベント
    $("#EditTxData").each(function(){
        $(this).bind("keyup", CheckTxData(this));
    });
} );

// ドラッグ＆ドロップ機能の初期化
function StartDragDrop(){
    jQuery('.Nghr_TextBox').draggable({
        containment: 'parent',
        scroll: false,
        start: function(event, ui) {
            // 編集する文章シートのIDを取得
            EditTextData=$(this).attr("id");

            // テキストエリアに文章シートの内容を表示
            EditText=$("#tx"+EditTextData).text();
            $("#EditTxData").val(EditText);

            // 文章シートの行間を取得
            var TxLineHeight=$(this).css("line-height");
            TxLineHeight=parseInt(TxLineHeight);
            $("#TextParam1").val(TxLineHeight);

            // 文章シートの字間を取得
            var TxLineWidth=$(this).css("letter-spacing");
            TxLineWidth=parseInt(TxLineWidth);
            $("#TextParam2").val(TxLineWidth);

            // 文章シートの文字サイズを取得
            var TxFontSize=$(this).css("font-size");
            TxFontSize=parseInt(TxFontSize);
            $("#TextParam3").val(TxFontSize);
	    }
    });
    jQuery('.Nghr_TextBox').resizable();
}

// ドキュメントを開く（ダイアログ表示）
function DocLoad(){
    $("#DataLoad").click();
}

// ドキュメントを開く（実際の処理）
function StartLoad(){
    FileName=$("#DataLoad").val();
    var NghrHTML=fs.readFileSync(FileName);
    $("#Paper").html(''+NghrHTML);
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
    if(FileName==""){
        DocSaveAs();
    }else{
        DocSave2();
    }
}

// 保存共通処理（上書き／別名）
function DocSave2(){
    jQuery('.Nghr_TextBox').resizable("destroy");
    var strData=$("#Paper").html();
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
    $("#DocPaperType").val("A4");
}

// ドキュメントの設定を保存
function SaveDocSetup(){
    var DocPaper=$("#DocPaperType").val();
    $("#PaperCSS").html('<link rel="stylesheet" href="css/paper/'+DocPaper+'.css">');
    $("#PaperCSS").attr("href","css/paper/"+DocPaper+".css");
    $("#DocSetupDiag").hide();
    $("#NoEdit").hide();
}

// ドキュメントの設定をキャンセル
function CancelDocSetup(){
    $("#DocSetupDiag").hide();
    $("#NoEdit").hide();
}

// ドキュメントの印刷
function DocPrint(){
    $("#Paper").printThis();
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
    $("#ts"+EditTextData).css("line-height",TxLineHeight+"px");
}

// 文字間の設定
function ChangeLineWidth(){
    var TxLineWidth=$("#TextParam2").val();
    $("#ts"+EditTextData).css("letter-spacing",TxLineWidth+"px");
}

// 文字サイズの設定
function ChangeFontSize(){
    var TxFontSize=$("#TextParam3").val();
    $("#ts"+EditTextData).css("font-size",TxFontSize+"px");
}

// 文字書体の設定
function ChangeFontFamily(){
    var TxFontFamily=$("#TextFontFamily").val();
    $("#tx"+EditTextData).css("font-family",""+TxFontFamily);
}

// 文字色の設定
function ChangeFontColor(){
    var TxFontColor=$("#TextFontColor").val();
    $("#tx"+EditTextData).css("color","#"+TxFontColor);
}

// 文章の左揃え
function ChangeFontLeft(){
    $("#ts"+EditTextData).css("text-align","left");
}

// 文章の中央揃え
function ChangeFontCenter(){
    $("#ts"+EditTextData).css("text-align","center");
}

// 文章の左揃え
function ChangeFontRight(){
    $("#ts"+EditTextData).css("text-align","right");
}

// 文字を太字にする
function ChangeFontBold(){
    var TxFontBold=$("#tx"+EditTextData).css("font-weight");
    if(TxFontBold=="bold"){
        $("#tx"+EditTextData).css("font-weight","normal");
    }else{
        $("#tx"+EditTextData).css("font-weight","bold");
    }
}

// 文字を斜体にする
function ChangeFontItalic(){
    var TxFontItalic=$("#tx"+EditTextData).css("font-style");
    if(TxFontItalic=="italic"){
        $("#tx"+EditTextData).css("font-style","normal");
    }else{
        $("#tx"+EditTextData).css("font-style","italic");
    }
}

// 文字に下線を引く
function ChangeFontUnderLine(){
    var TxFontUnderLine=$("#tx"+EditTextData).css("text-decoration");
    if(TxFontUnderLine=="underline"){
        $("#tx"+EditTextData).css("text-decoration","none");
    }else{
        $("#tx"+EditTextData).css("text-decoration","underline");
    }
}

// 文字を縦書きにする
function ChangeFontWritingMode(){
    var TxFontWritingMode=$("#tx"+EditTextData).css("writing-mode");
    if(TxFontWritingMode=="vertical-rl"){
        $("#tx"+EditTextData).css("writing-mode","horizontal-tb");
    }else{
        $("#tx"+EditTextData).css("writing-mode","tb-rl");
    }
}

// テキストエリアの編集時に発火するイベント
function CheckTxData(elm){
    var v, old = elm.value;
    return function(){
        if(old != (v=elm.value)){
            old = v;
            str = $(this).val().replace(/\n/g,"<br>\n");
            $("#tx"+EditTextData).html(str);
        }
    }
}