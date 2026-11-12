<script lang="ts">
	import { Blade, type BladeOptions } from '#lib'

	// Options that arrive late are tolerated in the browser, where the blade is
	// created once they're defined, so the server must tolerate them too
	const options = undefined as unknown as BladeOptions
</script>

<Blade {options} />
