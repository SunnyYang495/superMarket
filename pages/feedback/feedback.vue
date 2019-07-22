<template>
	<view>
		<view class="uniTextArea">
			<textarea class="feedbackText" maxlength="400"></textarea>
        </view>
		<view class="submitFeedback">
			<button type="primary">提交</button>
		</view>
	</view>
</template>

<script>
</script>

<style>
	.uniTextArea{
		text-align: center;
		margin: 10px 0;
	}
	.feedbackText{
		border: 1px solid #888888;
		display: inline-block;
	}
	.submitFeedback{
		padding:0 10px;
	}
</style>
