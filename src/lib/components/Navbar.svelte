<script>
	import Bell from '~icons/ic/baseline-notifications';
</script>

<div class="navbar bg-white h-190 shadow-xl position: absolute">
	<div class="flex-1 h-30">
		<a href="/" class="lg:pl-4"> </a>
	</div>

	<div class="flew-1 gap-x-10 pr-4">
		<div class="dropdown dropdown-bottom dropdown-end">
			<div
				tabindex="0"
				role="buttonghost"
				class="btn m-1 bg-white border-white"
			>
				<Bell class="size-8 m-0" />
			</div>
			<ul
				tabindex="0"
				class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
			>
				<li><a>Item 1</a></li>
				<li><a>Item 2</a></li>
			</ul>
		</div>
		<a class="hover:text-black">Logout</a>
	</div>
</div>
