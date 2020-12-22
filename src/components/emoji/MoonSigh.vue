<template>
	<div id="face" title="Line emoji (moon sigh)">
		<p class="eye eye-left"></p>
		<p class="eye eye-right"></p>
		<p id="mouth"></p>
		<p class="cheek cheek-left"></p>
		<p class="cheek cheek-right"></p>
		<p id="nose"></p>
		<p class="eyebow eb-left"></p>
		<p class="eyebow eb-right"></p>
	</div>
</template>

<script>
export default {

}
</script>

<style>
	p {
		margin: 0;
		padding: 0;
		display: block;
font-size: initial;
font-weight: initial;
box-sizing: initial;
	}

	#face {
		height: 100px;
		width: 100px;
		background-color: white;
		border: 3px inset #333;
		border-radius: 50%;
		position: relative;
		z-index: 20;
		overflow: hidden;
	}

	.eye {
		position: absolute;
		top: 30%;
		height: 17px;
		width: 9px;
		background-color: white;
		border: 3px inset #333;
		border-radius: 0 0 100% 100%;
		border-top: none;
	}

	.eye-left {
		left: 30%;
	}

	.eye-right {
		right: 30%;
	}

	.cheek {
		position: absolute;
		top: 50%;
		width: 20px;
		height: 10px;
		background-color: #f9c3c7;
		border-radius: 40%
	}

	.cheek-left {
		left: 7%;
	}

	.cheek-right {
		right: 7%;
	}

	#mouth {
		position: absolute;
		top: 60%;
		left: 50%;
		transform: translateX(-50%);
		height: 80px;
		width: 50%;
		border: 3px inset #333;
		border-radius: 300% 300% 0 0;
		z-index: 9;
		background-color: #dd6053
	}

	#mouth:before {
		content: '';
		position: absolute;
		top: 10px;
		width: 100%;
		height: 70px;
		background-color: #f9c3c7;
		border-radius: 50% 50% 0 0;
	}

	#mouth:after {
		content: '';
		position: absolute;
		width: calc(100% + 20px);
		height: 73%;
		background-color: white;
		bottom: 2px;
		left: -10px;
		z-index: 10;
		border-top: 3px inset #333;
		border-radius: 50% 50% 0 0;
		border-left: none;
		border-right: none;
		border-bottom: none;
	}

	#nose {
		position: absolute;
		width: 15px;
		border-top: 3px inset #333;
		height: 20px;
		border-radius: 50px 50px 0 0;
		left: 50%;
		top: calc(50% + 10px);
		transform: translate(-50%, -50%);
	}

	.eyebow {
		position: absolute;
		width: 20px;
		height: 7px;
		top: 15px;
	}

	.eb-left {
		left: 25%;
		border-bottom: 3px inset #333;
		border-radius: 0 0 100% 0;
	}

	.eb-right {
		right: 25%;
		border-bottom: 3px inset #333;
		border-radius: 0 0 0 100%;
	}
</style>