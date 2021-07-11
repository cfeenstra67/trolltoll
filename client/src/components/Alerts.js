import Alert from 'react-bootstrap/Alert'


export default function Alerts({ messages, setMessages, ...props }) {
  return (
    <>
      {messages.map((msg, i) => {
        let close = () => {
          setMessages(messages.filter((x, j) => j !== i));
        }
        return <Alert
          dismissible
          key={i}
          onClose={close}
          {...props}
          >
            {msg}
          </Alert>
      })}
    </>
  )
}
