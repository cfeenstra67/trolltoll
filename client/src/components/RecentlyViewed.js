import { useEffect } from 'react'
import Badge from 'react-bootstrap/Badge'
import ListGroup from 'react-bootstrap/ListGroup'
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom'

import { getRiddleUrl } from '../App'

var querystring = require("querystring-browser");


function riddleGetter(cookies) {
  return function() {
    if (!cookies.recentlyViewedRiddles) {
      return [];
    }
    return JSON.parse(atob(querystring.unescape(cookies.recentlyViewedRiddles))) 
  }
}


var cookieTrigger = {
  getCookies: function() {},
  onUpdate: function() {},
  buffered: []
}


function addBufferedItems(cookies) {

  if (!cookieTrigger.buffered) {
    return
  }

  let setRiddles = (data) => {
    let encoded = querystring.escape(btoa(JSON.stringify(data)))
    cookieTrigger.onUpdate(encoded)
  }

  let riddles = riddleGetter(cookies)() || []
  let riddleIds = riddles.map((r) => r.id)

  let buffer = cookieTrigger.buffered;
  cookieTrigger.buffered = [];

  buffer.forEach(function(riddleObj) {
    if (riddles.length === 0 || riddleIds.indexOf(riddleObj.id) === -1) {
      riddleObj.timestamp = new Date().getTime();
      riddles.push(riddleObj)
    } else if (riddles.length > 0) {
      let index = riddleIds.indexOf(riddleObj.id);
      riddles[index] = riddleObj;
      riddleObj.timestamp = new Date().getTime();
    }
  })

  riddles.sort(function(a, b) {
    let key = (x) => -x.timestamp
    return (key(a) > key(b)) - (key(a) < key(b))
  })

  riddles = riddles.slice(0, 5);

  setRiddles(riddles);

}

export function addView(riddle) {

  let cookies = cookieTrigger.getCookies();

  cookieTrigger.buffered.push(riddle)
  if (!cookies) {
    return
  }

  addBufferedItems(cookies)

}


function RiddleItem({ riddle }) {
  return (
    <ListGroup.Item
      action
      to={getRiddleUrl(riddle.id)}
      as={Link}
      key={riddle.id}
    >
      {riddle.text}
      {riddle.answered ? (
        ''
      ) : (
        <Badge className="float-end" variant="light">No answer yet</Badge>
      )}
    </ListGroup.Item>
  )
}


export default function RecentlyViewed() {

  const [cookies, setCookie] = useCookies(["recentlyViewedRiddles"])

  cookieTrigger.onUpdate = function(encoded) {
    setCookie("recentlyViewedRiddles", encoded, { path: "/" })
  }
  cookieTrigger.getCookies = function() {
    return cookies;
  }

  useEffect(() => {
    addBufferedItems(cookies)
  })

  let riddles = riddleGetter(cookies)()

  return riddles.length ? (
    <div>
      <h3>Recently Viewed</h3>
      <ListGroup>
        {riddles.map((riddle) => (
          <RiddleItem key={riddle.id} riddle={riddle} />
        ))}
      </ListGroup>
    </div>
  ) : <></>;
}
