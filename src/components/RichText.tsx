import { useEffect } from "react"

function Paragraph({child}) {
    useEffect(() => {
        console.log('text paragraph child', child)
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
        console.log('text list child', child)
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
    useEffect(() => {
        console.log('\n\n text', text)
        text.children.map(item => console.log('text item', item))
    }, [])
    return (<>
        {text.children.map(item => (<>
            {item.type === 'paragraph' && <Paragraph child={item} />}
            {item.type === 'list' && <List child={item} />}
        </>))}
    </>)
}