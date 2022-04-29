// Focus div based on nav button click

// Flip one coin and show coin image to match result when button clicked

// Flip multiple coins and show coin images in table as well as summary results
// Enter number and press button to activate coin flip series

// Guess a flip by clicking either heads or tails button


const mycoin = document.getElementById("coin")

mycoin.addEventListener("click", flipCoin)

async function flipCoin(){
    const myendpoint = "app/flip/"
    const url = document.baseURI+myendpoint

    await fetch(url)
    .then(function(response){
        console.log(result);
        document.getElementById("result").innerHTML = result.flip;
        document.getElementById("quarter").setAttribute("src", "assets/img/" + result.flip + ".png");
    })
}


const mycoins = document.getElementById("coins")
mycoins.addEventListener("submit", flipCoins)

async function flipCoins(event){
    event.preventDefault();
    const myendpoint = "app/flip/coins/"
    const myurl = document.baseURI+endpoint
    const formEvent = event.currentTarget

    try{
        const myFormData = new FormData(formEvent)
        const flips = await sendFlips({url, formData});
        console.log(flips)

        document.getElementById("heads").innerHTML = "Heads: " + flips.summary.heads;
        document.getElementById("tails").innerHTML = "Tails: "+flips.summary.tails;

        document.getElementById("coinlist").innerHTML = coinList(flips.raw);

    }
    catch (error){
        console.log(error)
    }
    
}


const mycall = document.getElementById("call")

mycall.addEventListener("submit", flipCall)

async function flipCall(event){
    event.preventDefault();

    const myendpoint = "app/flip/call/"
    const url = document.baseURI+myendpoint

    const formEvent = event.currentTarget

    try{
        const formData = new FormData(formEvent);
        const result = await sendFlips({url, formData});
        console.log(results);

        document.getElementById("choice").innerHTML = "Guess: " + results.call;
        document.getElementById("actual").innerHTML = "Actual: " + results.call;
        document.getElementById("results").innerHTML = "Result: " + results.call;

        document.getElementById("coingame").innerHTML = '<li><img src="assets/img/'+results.call+'.png" class="bigcoin" id="callcoin"></li><li><img src="assets/img/'+results.flip+'.png" class="bigcoin"></li><li><img src="assets/img/'+results.result+'.png" class="bigcoin"></li>';

    }
    catch (error){
        console.log(error)
    }
}
async function sendFlips({url, formData}){
    const data = Object.fromEntries(formData.entries());
    const myjson = JSON.stringify(data)

    console.log(myjson);

    const options = {
        method: "post",
        headers: {
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: myjson

    };

    const response = await fetch(url, options)
    return response.json()
}

function homeNav() {
    document.getElementById("homenav").className = "active";
    document.getElementById("home").className = "active";
    document.getElementById("singlenav").className = "";
    document.getElementById("single").className = "inactive";
    document.getElementById("multinav").className = "";
    document.getElementById("multi").className = "inactive";
    document.getElementById("guessnav").className = "";
    document.getElementById("guesscoin").className = "inactive";
  }
  function singleNav() {
    document.getElementById("homenav").className = "";
    document.getElementById("home").className = "inactive";
    document.getElementById("singlenav").className = "active";
    document.getElementById("single").className = "active";
    document.getElementById("multinav").className = "";
    document.getElementById("multi").className = "inactive";
    document.getElementById("guessnav").className = "";
    document.getElementById("guesscoin").className = "inactive";
  }
  function multiNav() {
    document.getElementById("homenav").className = "";
    document.getElementById("home").className = "inactive";
    document.getElementById("singlenav").className = "";
    document.getElementById("single").className = "inactive";
    document.getElementById("multinav").className = "active";
    document.getElementById("multi").className = "active";
    document.getElementById("guessnav").className = "";
    document.getElementById("guesscoin").className = "inactive";
  }
  function guessNav() {
    document.getElementById("homenav").className = "";
    document.getElementById("home").className = "inactive";
    document.getElementById("singlenav").className = "";
    document.getElementById("single").className = "inactive";
    document.getElementById("multinav").className = "";
    document.getElementById("multi").className = "inactive";
    document.getElementById("guessnav").className = "active";
    document.getElementById("guesscoin").className = "active";
  } 

  function coinList(myarray){
      var mytext = "";
      for (let i = 0; i < myarray.length; i++) {
        mytext += '<li><img src="assets/img/'+myarray[i]+'.png" class="bigcoin"></li>';

      }
      return mytext;
  }