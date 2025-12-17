import { useEffect } from "react"

function Paragraph({child}) {
    useEffect(() => {
        console.log('\n\n paragraph child', child.children?.map((grandchild, i) => grandchild.value))
    }, [])
    return (<p>
        {child.children?.map(grandchild => (
            grandchild.children?.map(item => 
                item.bold 
                ? <b>{item.value}</b>
                : item.italic
                    ? <i>{item.value}</i>
                    : <span>{item.value}</span>
            )
        ))}
    </p>)
}

function List({child}) {
    useEffect(() => {
        console.log('\n\n list child', child.children?.map((grandchild, i) => grandchild.value))
    }, [])
    return (<ul>
        {child.children?.map((grandchild, i) => (
            <li key={i}>
                {grandchild.children?.map(item => 
                    item.bold 
                    ? <b>{item.value}</b>
                    : item.italic
                        ? <i>{item.value}</i>
                        : <span>{item.value}</span>
                )}
            </li>
        ))}
    </ul>)
}

export default function RichText({text}) {
    text.children.map(item => {
        if(item.type === 'paragraph') return <Paragraph child={text.children} />
        if(item.type === 'list') return <List child={text.children} />
    })
}