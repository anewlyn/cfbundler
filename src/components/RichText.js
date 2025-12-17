function Inline({item}) {
    return item.bold ? <b>{item.value}</b> : item.italic ? <i>{item.value}</i> : {item.value}
}

function Paragraph({child}) {
    return (<p>
        {child.children?.map(grandchild => (<>
            {grandchild.children?.map(item => (<>
                    {item.type === 'text' && <Inline item={item} />}
                </>))
            }
        </>))}
    </p>)
}

function List({child}) {
    return (<ul>
        {child.children?.map((grandchild, i) => (
            <li key={i}>
                {grandchild.children?.map(item => 
                    {item.type === 'text' && <Inline item={item} />}
                )}
            </li>
        ))}
    </ul>)
}

export default function RichText({text}) {
    return (<>
        {text.children.map((item, i) => (<>
            {item.type === 'paragraph' && <Paragraph key={i} child={item} />}
            {item.type === 'list' && <List key={i} child={item} />}
        </>))}
    </>)
}