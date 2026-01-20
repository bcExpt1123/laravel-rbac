<?php

namespace App\Concerns;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Builder;

trait HasTree
{
    /**
     * Re-attach children to parent when deleting a node
     */
    public static function bootHasTree(): void
    {
        static::deleting(function ($model) {
            if ($model->children()->exists()) {
                $model->children()->update([
                    'parent_id' => $model->parent_id,
                ]);
            }
        });
    }

    /**
     * Parent relationship
     */
    public function parent()
    {
        return $this->belongsTo(static::class, 'parent_id');
    }

    /**
     * Children relationship
     */
    public function children()
    {
        return $this->hasMany(static::class, 'parent_id');
    }

    /**
     * Recursive descendants
     */
    public function descendants(): Collection
    {
        $items = $this->children->flatMap(function ($child) {
            return $child->descendants()->prepend($child);
        })->all();

        return new Collection($items);
    }

    /**
     * Get all descendants (including nested)
     */
    public function getDescendants(): Collection
    {
        return $this->descendants();
    }

    /**
     * Override to limit available parents
     */
    public function getTreeParentOptions(): ?array
    {
        return null;
    }

    /**
     * Get tree path (root → current)
     */
    public function getTreePath(): Collection
    {
        return new Collection(
            array_reverse($this->getTreePathNode($this))
        );
        // return collect($this->getTreePathNode($this))->reverse()->values();
    }

    protected function getTreePathNode($model, $path = []): array
    {
        $path[] = $model;

        if ($model->parent) {
            return $this->getTreePathNode($model->parent, $path);
        }

        return $path;
    }

    /**
     * Get all parents (excluding self)
     */
    public function getAllParents(): Collection
    {
        return $this->parent
            ? new Collection($this->getTreePathNode($this->parent))
            : new Collection();
        // return $this->parent ? collect($this->getTreePathNode($this->parent)) : collect();
    }

    /**
     * Get all parents as array
     */
    public function getAllParentsArray($model): array
    {
        if (!$model->parent) {
            return [];
        }

        return array_merge(
            [$model->parent],
            $this->getAllParentsArray($model->parent)
        );
    }

    /**
     * Get valid parent options (excluding self and descendants)
     */
    public function getPossibleParents(): array
    {
        $query = static::query();

        if ($options = $this->getTreeParentOptions()) {
            foreach ($options as $field => $value) {
                $query->where($field, $value);
            }
        }

        if ($this->exists) {
            $excludeIds = $this->getDescendants()->pluck('id')->push($this->id);
            $query->whereNotIn('id', $excludeIds);
        }

        return $query->pluck('title', 'id')->toArray();
    }

    /**
     * Validation rules for tree structure
     */
    public function addTreeValidationRules(array $rules): array
    {
        return array_merge($rules, [
            'parent_id' => ['nullable', 'integer', 'exists:' . $this->getTable() . ',id'],
        ]);
    }

    /**
     * Root scope (no parent)
     */
    public function scopeRoot(Builder $query): Builder
    {
        return $query->whereNull($this->getTable() . '.parent_id');
    }

    /**
     * Include children count
     */
    public function scopeIncludeChildrenCount(Builder $query): Builder
    {
        return $query
            ->withCount('children')
            ->addSelect($this->getTable() . '.*');
    }
}
