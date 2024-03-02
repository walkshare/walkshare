<script>
	import Bell from '~icons/ic/baseline-notifications';
	import LogOut from '~icons/ic/outline-log-out';
</script>

<div class="navbar shadow-xl sticky top-0">
	<div class="flex-1 h-30">
		<a href="/" class="lg:pl-4"> </a>
	</div>

	<div class="gap-x-10 pr-4">
		<div class="dropdown dropdown-bottom dropdown-end z-20">
			<div
				tabindex="0"
				role="button"
				class="btn m-1"
			>
				<Bell class="size-8 m-0" />
			</div>
			<ul
				tabindex="-1"
				class="dropdown-content z-20 menu p-2 shadow bg-base-100 rounded-box w-52"
			>
				<li><a>Item 1</a></li>
				<li><a>Item 2</a></li>
			</ul>
		</div>

		<a class="btn btn-secondary">Logout <LogOut /></a>
	</div>
</div>
