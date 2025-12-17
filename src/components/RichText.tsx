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

export default function RichText(text: any) {
    return(
        text.children.map(child => {
            child.type === 'paragraph' && <Paragraph child />
            child.type === 'list' && <List child />
        })
    )
}