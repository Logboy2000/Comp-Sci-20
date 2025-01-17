class Graph {
    constructor({
        yellowThreshold = 50,
        greenThreshold = 100,
        labelCount = 3,
        stepSize = 50,
        minYScale = 100,
        decimalPlaces = 0,
        higherIsBetter = true
    } = {}) {
        this.graphData = new Map();
        this.yellowThreshold = yellowThreshold;
        this.greenThreshold = greenThreshold;
        this.labelCount = labelCount;
        this.stepSize = stepSize;
        this.minYScale = minYScale;
        this.decimalPlaces = decimalPlaces;
        this.higherIsBetter = higherIsBetter;
    }

    getGraphData(title) {
        if (!this.graphData.has(title)) {
            this.graphData.set(title, {
                valueHistory: [],
                currentMaxValue: undefined
            });
        }
        return this.graphData.get(title);
    }

    drawGraph(ctx, value, x, y, w, h, title = 'Title', xAxisName = 'x-axis', yAxisName = 'y-axis') {
        const { valueHistory, currentMaxValue } = this.getGraphData(title);

        const graphWidth = w;
        const graphHeight = h;

        const graphX = x + 25;
        const graphY = y + 15;

        valueHistory.push(value);
        if (valueHistory.length > graphWidth) {
            valueHistory.shift();
        }

        const maxValue = Math.max(...valueHistory, this.minYScale);
        const targetMaxValue = Math.ceil(maxValue / this.stepSize) * this.stepSize;

        if (currentMaxValue === undefined) {
            this.graphData.get(title).currentMaxValue = targetMaxValue;
        }

        const lerp = (start, end, amt) => (1 - amt) * start + amt * end;
        let updatedMaxValue = this.graphData.get(title).currentMaxValue;
        updatedMaxValue = lerp(updatedMaxValue, targetMaxValue, 0.1);
        this.graphData.get(title).currentMaxValue = updatedMaxValue;
        const roundedMaxValue = updatedMaxValue;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(graphX, graphY, graphWidth, graphHeight);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 5;
        ctx.strokeRect(graphX, graphY, graphWidth, graphHeight);
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        for (let i = 0; i < valueHistory.length; i++) {
            const currentValue = valueHistory[i];

            if (this.higherIsBetter) {
                if (currentValue >= this.greenThreshold) {
                    ctx.strokeStyle = 'rgb(0, 255, 38)';
                } else if (currentValue >= this.yellowThreshold) {
                    ctx.strokeStyle = 'rgb(255, 255, 0)';
                } else {
                    ctx.strokeStyle = 'rgb(255, 0, 0)';
                }
            } else {
                if (currentValue <= this.greenThreshold) {
                    ctx.strokeStyle = 'rgb(0, 255, 38)';
                } else if (currentValue <= this.yellowThreshold) {
                    ctx.strokeStyle = 'rgb(255, 255, 0)';
                } else {
                    ctx.strokeStyle = 'rgb(255, 0, 0)';
                }
            }

            const x = graphX + (i * (graphWidth / valueHistory.length));
            const normalizedValue = Math.min(Math.max(currentValue, 0), roundedMaxValue);
            const y = Math.min(Math.max(
                graphY + graphHeight - (normalizedValue / roundedMaxValue * graphHeight),
                graphY
            ), graphY + graphHeight);

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
        }
        ctx.stroke();
        ctx.closePath();

        const greenColor = 'rgba(0, 255, 38, 0.3)';
        const yellowColor = 'rgba(255, 255, 0, 0.3)';
        const redColor = 'rgba(255, 0, 0, 0.3)';

        if (this.higherIsBetter) {
            ctx.fillStyle = greenColor;
            const greenHeight = (roundedMaxValue - this.greenThreshold) / roundedMaxValue * graphHeight;
            ctx.fillRect(graphX, graphY, graphWidth, greenHeight);

            ctx.fillStyle = yellowColor;
            const yellowHeight = (this.greenThreshold - this.yellowThreshold) / roundedMaxValue * graphHeight;
            ctx.fillRect(graphX, graphY + greenHeight, graphWidth, yellowHeight);

            ctx.fillStyle = redColor;
            const redHeight = this.yellowThreshold / roundedMaxValue * graphHeight;
            ctx.fillRect(graphX, graphY + greenHeight + yellowHeight, graphWidth, redHeight);
        } else {
            ctx.fillStyle = greenColor;
            const greenHeight = this.greenThreshold / roundedMaxValue * graphHeight;
            ctx.fillRect(graphX, graphY + (graphHeight - greenHeight), graphWidth, greenHeight);

            ctx.fillStyle = yellowColor;
            const yellowHeight = (this.yellowThreshold - this.greenThreshold) / roundedMaxValue * graphHeight;
            ctx.fillRect(graphX, graphY + (graphHeight - greenHeight - yellowHeight), graphWidth, yellowHeight);

            ctx.fillStyle = redColor;
            const redHeight = (roundedMaxValue - this.yellowThreshold) / roundedMaxValue * graphHeight;
            ctx.fillRect(graphX, graphY, graphWidth, redHeight);
        }

        ctx.fillStyle = 'black';

        for (let i = 0; i <= this.labelCount; i++) {
            const value = (roundedMaxValue * (this.labelCount - i) / this.labelCount).toFixed(this.decimalPlaces);
            const yPos = graphY + (graphHeight * i / this.labelCount);
            this.drawText(ctx, value.toString(), graphX + graphWidth + 5, yPos, 'left', 10);
        }
        this.drawText(ctx, xAxisName, graphX + graphWidth / 2, graphY + graphHeight + 15, 'center');
        this.drawText(ctx, yAxisName, graphX - 5, (graphY + graphHeight) / 2, 'right');
        this.drawText(ctx, title, graphX + graphWidth / 2, graphY - 5, 'center');
    }

    drawText(ctx, text, x, y, alignment = 'left', fontSize = 10, fontName = 'Comic Sans MS') {
        ctx.font = fontSize + "px " + fontName;
        ctx.textAlign = alignment;
        ctx.fillText(text, x, y);
    }
}




function drawText(ctx, text, x, y, alignment = 'left', fontSize = 10, fontName = 'Comic Sans MS') {
    ctx.font = fontSize + "px " + fontName
    ctx.textAlign = alignment
    ctx.fillText(text, x, y)
}