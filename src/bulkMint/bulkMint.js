function fetchBatch(batchID, xrpAddress, seed, xrplNode){
    $.ajax({
        url: "https://api.nftmaster.com/Batch?id="+batchID,
        contentType: "application/json",
        dataType: 'json',
        success: function(result){
            console.log(result);
            if(result.nfts!=null){
                $("#result").text("NFTs found: "+result.nfts.length);

                mintNFTs(result.nfts, xrpAddress, seed, xrplNode);
            }else{
                $("#result").text("No NFTs found for batch id: "+batchID);
            }
        },
        error: function(){
            $("#result").text("No batch found or an error occured. If you require support email support@nftmaster.com");
        }
    })
}

const delay = ms => new Promise(res => setTimeout(res, ms));

function mintNFTs(NFTs, xrpAddress, seed, xrplNode) {
    let socket = new WebSocket(xrplNode);

    socket.onopen = async function (e) {
        for(let i = 0; i<NFTs.length; i++){

            let jsonText = "{\"command\":\"submit\",\"secret\":\"" + seed + "\",\"tx_json\":{\"TransactionType\":\"NFTokenMint\",\"Account\":\"" + xrpAddress + "\",\"NFTokenTaxon\":" + NFTs[i].taxon + ",\"Flags\":" + NFTs[i].flags + ",\"TransferFee\":" + NFTs[i].transferFee + ",\"Fee\":\""+100+"\", \"URI\":\"" + NFTs[i].uri + "\"}}";

            let currentNumber = i +1;
            $("#mintingProgress").text("Progess: "+currentNumber+"/"+NFTs.length);
            //wait 3 seconds before sending the next request.
            if(currentNumber == NFTs.length){
                $("#completedMinting").text("🚀 Minting completed! 🚀");
            }
            socket.send(jsonText);
            await delay(3000);
        }
        socket.close();
    };
}


$(document).ready(function() {
    $( "#mint-batch" ).submit(function( event ) {
        var xrplNode = $("#XRPLNode").val();
        var batchID = $("#BatchID").val();
        var xrpAddress = $("#XrpAddress").val();
        var seed = $("#Seed").val();
        fetchBatch(batchID, xrpAddress, seed, xrplNode);
        event.preventDefault();
      });
});