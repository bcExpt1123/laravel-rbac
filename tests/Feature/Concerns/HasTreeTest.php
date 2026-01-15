<?php

namespace Tests\Feature\Concerns;

use Tests\TestCase;
use Tests\Models\Category;

class HasTreeTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // Run migration
        $this->loadMigrationsFrom(__DIR__.'/../database/migrations');
        $this->artisan('migrate', ['--database' => 'sqlite'])->run();
    }

    /** @test */
    public function it_creates_parent_child_relationship()
    {
        $parent = Category::create(['title' => 'Parent']);
        $child = Category::create(['title' => 'Child', 'parent_id' => $parent->id]);

        $this->assertEquals($parent->id, $child->parent->id);
        $this->assertCount(1, $parent->children);
    }

    /** @test */
    public function it_returns_descendants_recursively()
    {
        $root = Category::create(['title' => 'Root']);
        $child = Category::create(['title' => 'Child', 'parent_id' => $root->id]);
        $grandchild = Category::create(['title' => 'Grandchild', 'parent_id' => $child->id]);

        $descendants = $root->getDescendants();

        $this->assertCount(2, $descendants);
        $this->assertTrue($descendants->contains($child));
        $this->assertTrue($descendants->contains($grandchild));
    }

    /** @test */
    public function it_returns_tree_path()
    {
        $root = Category::create(['title' => 'Root']);
        $child = Category::create(['title' => 'Child', 'parent_id' => $root->id]);
        $grandchild = Category::create(['title' => 'Grandchild', 'parent_id' => $child->id]);

        $path = $grandchild->getTreePath();

        $this->assertEquals(
            ['Root', 'Child', 'Grandchild'],
            $path->pluck('title')->toArray()
        );
    }

    /** @test */
    public function it_returns_all_parents()
    {
        $root = Category::create(['title' => 'Root']);
        $child = Category::create(['title' => 'Child', 'parent_id' => $root->id]);
        $grandchild = Category::create(['title' => 'Grandchild', 'parent_id' => $child->id]);

        $parents = $grandchild->getAllParents();

        $this->assertCount(2, $parents);
        $this->assertEquals(['Child', 'Root'], $parents->pluck('title')->toArray());
    }

    /** @test */
    public function it_excludes_self_and_descendants_from_possible_parents()
    {
        $root = Category::create(['title' => 'Root']);
        $child = Category::create(['title' => 'Child', 'parent_id' => $root->id]);
        $grandchild = Category::create(['title' => 'Grandchild', 'parent_id' => $child->id]);
        $other = Category::create(['title' => 'Other']);

        $options = $child->getPossibleParents();

        $this->assertArrayNotHasKey($child->id, $options);
        $this->assertArrayNotHasKey($grandchild->id, $options);
        $this->assertArrayHasKey($root->id, $options);
        $this->assertArrayHasKey($other->id, $options);
    }

    /** @test */
    public function it_reassigns_children_when_deleting_parent()
    {
        $root = Category::create(['title' => 'Root']);
        $parent = Category::create(['title' => 'Parent', 'parent_id' => $root->id]);
        $child = Category::create(['title' => 'Child', 'parent_id' => $parent->id]);

        $parent->delete();
        $child->refresh();

        $this->assertEquals($root->id, $child->parent_id);
    }

    /** @test */
    public function root_scope_returns_only_root_nodes()
    {
        $root = Category::create(['title' => 'Root']);
        $child = Category::create(['title' => 'Child', 'parent_id' => $root->id]);

        $roots = Category::root()->get();

        $this->assertCount(1, $roots);
        $this->assertEquals('Root', $roots->first()->title);
    }

    /** @test */
    public function include_children_count_scope_works()
    {
        $root = Category::create(['title' => 'Root']);
        Category::create(['title' => 'Child1', 'parent_id' => $root->id]);
        Category::create(['title' => 'Child2', 'parent_id' => $root->id]);

        $node = Category::includeChildrenCount()->find($root->id);

        $this->assertEquals(2, $node->children_count);
    }
}
