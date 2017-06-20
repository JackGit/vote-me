var page = require('webpage').create()

page.onConsoleMessage = function (message) {
  console.log(message)
}

page.open('http://m.youxiake.com/h5/run_area?city=4', function (status) {
  if (status === 'success') {
    console.log('open vote page successfully')

    page.evaluate(function () {
      var JACK_UID = 1278852
      var TARGET_POSITION = 4
      var TOTAL_SCROLL = 10
      var scrollCount = 0
      var seedId = 0
      var jackVote = 0

      console.log('you are visiting webpage', document.title)
      console.log("jack's uid is " + JACK_UID)

      function scrollToBottom () {
        window.document.body.scrollTop = document.body.scrollHeight
      }

      function getJackVote () {
        return +document.querySelector('[data-pid="' + JACK_UID + '"]').parentElement.nextElementSibling.querySelector('.vote').innerText
      }

      function getUids () {
        return Array.prototype.slice.call(document.querySelectorAll('div.pic a'), 0).map(function (a) {
          return a.href.split('=')[1]
        })
      }

      function voteJack (total) {
        var uids = getUids()

        console.log('going to give jack ' + total + ' votes')
        for (var i = 0; i < total; i++) {
          vote(uids[i], JACK_UID)
        }
      }

      function vote (uid, targetId) {
        var image = new Image()
        uid = uid || new Date.now()
        image.src = 'http://m.youxiake.com/h5/run_vote?uid=' + uid + '&pid=' + targetId
        console.log('uid:' + uid + ' voted for jack')
      }

      function first10Votes () {
        return Array.prototype.slice.call(document.querySelectorAll('.vote'), 0).filter(function (item, index) {
          return index < 10
        }).map(function (vote) {
          return +vote.innerText
        })
      }

      seedId = setInterval(function () {
        if (scrollCount < TOTAL_SCROLL) {
          // scroll down 10 times
          scrollToBottom()
          scrollCount++
          console.log('scroll page down', scrollCount)
        } else {
          clearInterval(seedId)

          // get jack's vote
          jackVote = getJackVote()
          console.log("jack's current vote is", jackVote)

          // get first 10 votes
          var votes = first10Votes()
          console.log('current vote ranking (first 10) is', votes)

          // if less than no. 5
          if (jackVote < votes[TARGET_POSITION]) {
            var n = votes[4] - jackVote
            voteJack(n)
          } else {
            console.log("no need to vote more, jack's position is", votes.indexOf(jackVote))
          }
        }
      }, 2000)
    })
  }
  // phantom.exit()
})
