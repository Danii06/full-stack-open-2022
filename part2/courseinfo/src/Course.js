

const Header = (props) => {
return <h1>{props.name}</h1>
}

const Part = (props) => {
return <p>{props.part.name} {props.part.exercises}</p>
}

const Content = (props) => {
return props.parts.map((part) => {
    return <Part key={part.name} part={part} />
});
}

const Total = (props) => {
return <b>Number of exercises {props.parts.reduce((prev, curr) => prev + curr.exercises, 0)}</b>
}

const Course = ({ course }) => {
return (
<>
    <Header name={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
</>
)
}

export default Course;