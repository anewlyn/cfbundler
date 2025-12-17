import { useEffect } from "react"

function Paragraph(child) {
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

function List(child) {
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
    if (text.type === 'paragraph') return <Paragraph child={text.children} />
    if (text.type === 'list') return <List child={text.children} />
}