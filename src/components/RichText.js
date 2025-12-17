export default function RichText(value) {
    value.children.map(child => {
        switch (child.type) {
            case 'paragraph':
                return <p key={i}>{ child.value }</p>
                break
            case 'list':
                return (<ul>
                    {child.children?.map((grandchild, i) => (
                        <li>
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
                break
            default:
                break
        }
    })
}