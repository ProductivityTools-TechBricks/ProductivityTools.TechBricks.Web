import { useEffect, useRef } from "react";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

// Bricks are stored as {id, description, brick}; very old ones may still use {key, value}.
export const brickTitle = (b) => b.description ?? b.key ?? '';
export const brickValue = (b) => b.brick ?? b.value ?? '';

function Highlight({ text, query }) {
    if (!query || !text) return text;
    const parts = [];
    const lower = text.toLowerCase();
    const needle = query.toLowerCase();
    let start = 0;
    let i = lower.indexOf(needle);
    while (i !== -1) {
        parts.push(text.slice(start, i));
        parts.push(<mark key={i}>{text.slice(i, i + needle.length)}</mark>);
        start = i + needle.length;
        i = lower.indexOf(needle, start);
    }
    parts.push(text.slice(start));
    return parts;
}

function BrickItem({ brick, query, editing, onEdit, onDone, updateBrick, removeBrick, initMoveBrick, onCopy, onUpvote }) {
    const titleRef = useRef(null);
    const title = brickTitle(brick);
    const value = brickValue(brick);

    useEffect(() => {
        if (editing && titleRef.current) {
            titleRef.current.focus();
        }
    }, [editing]);

    const handleDragStart = (e) => {
        e.dataTransfer.setData("brickId", brick.id);
        e.dataTransfer.setData("text/plain", brick.id);
        e.dataTransfer.effectAllowed = "move";
    };

    const onKeyDown = (e) => {
        if (e.key === 'Escape') onDone();
    };

    if (editing) {
        return (
            <div className="brick brick--editing" id={`brick-${brick.id}`}>
                <input
                    ref={titleRef}
                    className="brick__titleInput"
                    name="description"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => updateBrick(brick.id, e.target.value, value)}
                    onKeyDown={onKeyDown}
                />
                <textarea
                    className="brick__valueInput"
                    name="brick"
                    placeholder="Value"
                    rows={Math.max(3, value.split('\n').length + 1)}
                    value={value}
                    onChange={(e) => updateBrick(brick.id, title, e.target.value)}
                    onKeyDown={onKeyDown}
                />
                <div className="brick__editHint">
                    <button className="tb-button" onClick={onDone}>Done</button>
                    Esc to finish · saved automatically
                </div>
            </div>
        );
    }

    return (
        <div className="brick" id={`brick-${brick.id}`}>
            <div className="brick__header">
                <button className="brick__vote" title="Upvote - bricks with more votes are shown higher" onClick={() => onUpvote(brick.id)}>
                    <ArrowUpwardIcon />
                    <span>{brick.votes || 0}</span>
                </button>
                <span className="brick__title" draggable onDragStart={handleDragStart} title="Drag to another pallet">
                    {title ? <Highlight text={title} query={query} /> : <i className="brick__untitled">Untitled</i>}
                </span>
                <span className="brick__actions">
                    <button title="Copy value" onClick={() => onCopy(value)}><ContentCopyIcon /></button>
                    <button title="Edit" onClick={onEdit}><EditIcon /></button>
                    <button title="Move to another pallet" onClick={() => initMoveBrick(brick)}><DriveFileMoveIcon /></button>
                    <span className="brick__drag" draggable onDragStart={handleDragStart} title="Drag to another pallet"><DragIndicatorIcon /></span>
                    <button title="Delete" className="brick__delete" onClick={() => removeBrick(brick.id)}><DeleteIcon /></button>
                </span>
            </div>
            {value && (
                <div className="brick__value">
                    <Highlight text={value} query={query} />
                </div>
            )}
        </div>
    );
}

export default BrickItem
