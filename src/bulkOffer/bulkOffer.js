
 1
 2
 3
 4
 5
 6
 7
 8
 9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
function fetchBatch(batchID, xrpAddress, seed, xrplNode){
    $.ajax({
        url: "https://api.nftmaster.com/IOUOffer?id="+batchID,
        contentType: "application/json",
        dataType: 'json',
        success: function(result){
            
            if(result.offers!=null){
                $("#result").text("Offers found: "+result.offers.length);
                
                signOffers(result.offers, xrpAddress, seed, xrplNode);
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

function signOffers(offers, xrpAddress, seed, xrplNode) {
    let socket = new WebSocket(xrplNode);

    socket.onopen = async function (e) {
        for(let i = 0; i<offers.length; i++){

            let jsonText = "{\"command\":\"submit\",\"secret\":\"" + seed + "\",\"tx_json\":{\"TransactionType\":\"NFTokenCreateOffer\",\"Account\":\"" + xrpAddress + "\",\"NFTokenID\":\"" + offers[i].nfTokenID + "\",\"Destination\":\"" + offers[i].destination + "\",\"Amount\":\"" + offers[i].amount + "\",\"Fee\":\""+100+"\",\"Flags\":" + offers[i].flags + ",\"Memos\":[{\"Memo\":{\"MemoType\":\"" + offers[i].memoType + "\",\"MemoData\":\"" + offers[i].memoData + "\"}}]}}";
            
            let currentNumber = i +1;
            $("#signingProgress").text("Progess: "+currentNumber+"/"+offers.length);
            //wait 5 seconds before sending the next request.
            if(currentNumber == offers.length){
                $("#completedSigning").text("🚀 Offers signed! 🚀");
            }
            socket.send(jsonText);
            await delay(5000);
        }
        socket.close();
    };
}


$(document).ready(function() {
    $( "#sign-batch" ).submit(function( event ) {
        var xrplNode = $("#XRPLNode").val();
        var batchID = $("#BatchID").val();
        var xrpAddress = $("#XrpAddress").val();
        var seed = $("#Seed").val();
        fetchBatch(batchID, xrpAddress, seed, xrplNode);
        event.preventDefault();
      });
});
