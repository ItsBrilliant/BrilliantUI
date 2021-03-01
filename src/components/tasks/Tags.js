import React from 'react'

export default function Tags(props) {
    const tags = props.tags.map(t => <span className="tag" key={t}>{t + " "}</span>)
    return (
        <div className="tags">
            {tags}
        </div>
    )
}
