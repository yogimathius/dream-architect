<script lang="ts">
	// Test-only fixture: throws during render so ErrorBoundary.test.ts can verify
	// that the boundary actually catches errors from its children.
	throw new Error('Boom from child');
</script>

<div>should never render</div>
