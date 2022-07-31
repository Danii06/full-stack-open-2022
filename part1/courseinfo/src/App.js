

const Header = (props) => {
  return (
    <>
      <h1>{props.name}</h1>
    </>
  )
}

const Part = (props) => {
  return <p>{props.data.name} {props.data.amount}</p>
}

const Content = (props) => {
  return props.content.map((part) => {
    return <Part key={part.name} data={part} />
  });
}

const Total = (props) => {
  return <p>Number of exercises {props.content.reduce((prev, curr) => prev + curr.amount, 0)}</p>
}

const App = () => {
  const data = {
    name: 'Half Stack application development',
    content: [
      {
        name: "Fundamentals of React",
        amount: 10
      },
      {
        name: "Using props to pass data",
        amount: 7
      },
      {
        name: "State of a component",
        amount: 14
      }
    ]
  }

  return (
    <>
      <Header name={data.name} />
      <Content content={data.content} />
      <Total content={data.content} />
    </>
  )
}

export default App;
