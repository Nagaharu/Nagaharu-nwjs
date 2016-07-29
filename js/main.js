var EditText,EditTextArray,EditTextData,EditTextClass;
var NewTextID=0;

window.onload=function(){
}

// ドラッグ操作の有効化
jQuery(function(){
    jQuery('#Nghr_TextBox').draggable({
        containment: 'parent',
        scroll: false,
    });
    $("#EditTxData").each(function(){
        $(this).bind("keyup", CheckTxData(this));
    });
} );

// ドキュメントの印刷
function DocPrint(){
    $("#Paper").printThis();
}

// 文字シートの追加
function AddText(){
    $("#Paper").append('<span class="Nghr_TextBox" id="'+NewTextID+'"><span id="tx'+NewTextID+'">新規文字シート</span></span>');
    NewTextID++;
    $('.Nghr_TextBox').resizable();
    jQuery('.Nghr_TextBox').draggable({
        containment: 'parent',
        scroll: false,
        start: function(event, ui) {
            EditTextData=$(this).attr("id");
            EditText=$("#tx"+EditTextData).html();
            $("#EditTxData").val(EditText);
            var TxLineHeight=$(this).css("line-height");
            TxLineHeight=parseInt(TxLineHeight);
            $("#TextParam1").val(TxLineHeight);
            var TxLineWidth=$(this).css("letter-spacing");
            TxLineWidth=parseInt(TxLineWidth);
            $("#TextParam2").val(TxLineWidth);
            var TxFontSize=$(this).css("font-size");
            TxFontSize=parseInt(TxFontSize);
            $("#TextParam3").val(TxFontSize);
            
	    }
    });
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
    $("#tx"+EditTextData).css("font-family",""+TxFontFamily);
}

// 文字色の設定
function ChangeFontColor(){
    var TxFontColor=$("#TextFontColor").val();
    $("#tx"+EditTextData).css("color","#"+TxFontColor);
}

function CheckTxData(elm){
    var v, old = elm.value;
    return function(){
        if(old != (v=elm.value)){
            old = v;
            str = $(this).val().replace(/\n/g,"<br>\n");
            //$("#"+EditTextData).html(''+str+'<div class="ui-resizable-handle ui-resizable-e'+EditTextArray[1]);
            $("#tx"+EditTextData).html(str);
        }
    }
}