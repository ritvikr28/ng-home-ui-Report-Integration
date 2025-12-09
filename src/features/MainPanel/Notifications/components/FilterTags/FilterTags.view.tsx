import React from "react";
import { Tag, TagColor, TagSize } from "@essnextgen/ui-kit";

interface FilterTag {
    id: string;
    label: string;
    type: 'status' | 'priority' | 'date';
}

interface FilterTagsProps {
    tags: FilterTag[];
    onRemove: (type: 'status' | 'priority' | 'date') => void;
}

const FilterTags: React.FC<FilterTagsProps> = ({ tags, onRemove }) => {
    if (tags.length === 0) {
        return null;
    }

    return (
        <div className="filter-tags-container" data-testid="filter-tags-container">
            {tags.map((tag) => (
                <div key={tag.id} className="filter-tag-wrapper">
                    <Tag
                        id={tag.id}
                        text={tag.label}
                        color={TagColor.Neutral}
                        size={TagSize.Small}
                    />
                    <button
                        type="button"
                        className="filter-tag-close"
                        onClick={() => onRemove(tag.type)}
                        aria-label={`Remove ${tag.label} filter`}
                        data-testid={`remove-filter-${tag.id}`}
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
};

export default FilterTags;

