export default function RichText(value) {
    switch (value.type) {
        case 'paragraph':
            return <p key={i}>{ value.value }</p>
            break
        case 'list':
            return (<ul>
                {value.children?.map((child, i) => (
                    <li>
                        {child.children?.map(item => 
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
}