//required dimensions
var margin = { top:20, right:40, bottom:20, left:70 };
const width = 960-margin.left-margin.right;
const height = 410-margin.top-margin.bottom;

//read data
d3.csv('./AgeGroup.csv').then(data => {

    //extract the year column names
    let columns = data.columns.slice(1);
    
    //first and last date range
    let period = [columns[0], columns[columns.length-1]];

    //latest period
    let latest_yr = [columns[columns.length-1]];

    //define data as required for plotting
    let plot_data = {
        value: data.map(d => ({
            age_group: d['Age Group'],
            perc: latest_yr.map(yr => +d[yr]) //[yr, +d[yr]]
        })),
        year: latest_yr,
        x_text: "Free sugars intake (% of total energy) as of 2014/15-2015/16"
    }

    let perc_change_data = {
        age_group: data.map(d => d['Age Group']),
        perc_change: data.map(d => Math.round((((+d[period[1]]-(+d[period[0]]))/(+d[period[0]]))*100 + Number.EPSILON)*100/100)),
        x_text: "% change in the free sugars intake since 2008 to 2016"
    }

    //svg container 
    const svg = d3.select(".svg-container")
                    .append('svg')
                    .attr('width', width+margin.left+margin.right)
                    .attr('height', height+margin.top+margin.bottom)

    //LHS viz 

    //scale for LHS x-axis
    const xScaleL = d3.scaleLinear()
                    .domain([d3.min(perc_change_data.perc_change)-1, d3.max(perc_change_data.perc_change)+1]) //d3.max(d.map(e => e[1]))+1)]
                    .range([margin.left, width/1.8-margin.right])           

    //define the x-axis using the x scale
    const xAxisL = d3.axisBottom(xScaleL);

    //scale for y-axis
    const yScaleL = d3.scaleBand()
                    .domain(perc_change_data.age_group)
                    .range([height-margin.bottom, margin.top])
                    .padding(0.25)
        
    //define the y-axis using the y scale
    const yAxisL = d3.axisLeft(yScaleL);         

    //append 'g' to the svg and call axes    
    svg.append('g')
        .call(xAxisL)
        .attr('transform', `translate(${margin.left}, ${height-margin.bottom})`);

    svg.append('g')
        .call(yAxisL)
        .attr('class','y-axisL')
        .attr('transform', `translate(${margin.left+57}, 0)`)
        .call(g => g.select('.domain').remove())

    //modify y-axis text font-size
    d3.selectAll(".y-axisL>.tick>text")
    .each(function(d, i){
        d3.select(this).style("font-size","13px");
    });

    //rect svg    
    svg.selectAll('.bars')
        .data(perc_change_data.perc_change)
        .join('rect')
        .attr('class', 'bars')
        .attr('x', d => xScaleL(Math.min(d, 0)))
        .attr('y', (d,i) => yScaleL(perc_change_data.age_group[i]))
        .attr('width', d => Math.abs(xScaleL(d) - xScaleL(0)))
        .attr('height', yScaleL.bandwidth())
        .attr('fill', d => d > 0? "#F65B39" : "#DFD7D5") 
        .attr('transform', `translate(${margin.left}, 0)`)

    svg.selectAll('.x-axisL-text')
        .data([perc_change_data])
        .join('text')
        .attr('class', 'x-axisL-text')
        .attr('x', 2*margin.left)
        .attr('y', height-margin.bottom+40)
        .attr('fill', '#333')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 13)
        .text(d => d.x_text)

    //RHS viz

    const xScaleR = d3.scaleLinear()
                .domain([0, d3.max(plot_data.value, d => d3.max(d.perc)+1)])
                .range([margin.right-40, width-6.5*margin.left]) //margin.left, width/2-margin.right

    const xAxisR = d3.axisBottom(xScaleR);

    svg.append('g')
        .call(xAxisR)
        .attr('transform', `translate(${width-margin.right-255}, ${height-margin.bottom})`);
    
    svg.selectAll('.area-bar')
        .data([plot_data.value])
        .join('rect')
        .attr('class', 'area-bar')
        .attr('x', xScaleR(0))
        .attr('width', xScaleR(5))
        .attr('height', d => d.length*yScaleL.bandwidth()+92)
        .attr('fill', '#CFC7C5') //F0EAE8
        .attr('opacity', 0.35) 

        .attr('stroke', 'none')
        .attr('transform', `translate(${width-margin.right-255}, 20)`)

    svg.selectAll('.perc-bar')
        .data(plot_data.value)
        .join('rect')
        .attr('class', 'perc-bar')
        .attr('x', xScaleR(0))
        .attr('y', (d,i) => yScaleL(perc_change_data.age_group[i]))
        .attr('width', d => xScaleR(d3.min(d.perc)))
        .attr('height', yScaleL.bandwidth())
        .attr('fill', '#DFD7D5') 
        .attr('stroke', 'none')
        .attr('transform', `translate(${width-margin.right-255}, 0)`)
    
    svg.selectAll('.x-axisR-text')
        .data([plot_data])
        .join('text')
        .attr('class', 'x-axisR-text')
        .attr('x', width-margin.right-255+20)
        .attr('y', height-margin.bottom+40)
        .attr('fill', '#333')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 13)
        .text(d => d.x_text)

    const chart_text = 'Recommended limit';
    svg.selectAll('.chart-text')
        .data([plot_data.value])
        .join('text')
        .attr('class', 'chart-text')
        .attr('x',width-margin.right-255+xScaleR(3))
        .attr('y', 10)
        .attr('font-family', 'sans-serif')
        .attr('font-size', 10)
        .text(chart_text)


    //************//

    // const svgL = d3.select('svg-container')
    //                 .attr('width', width/4+margin.left+margin.right)
    //                 .attr('height', height+margin.top+margin.bottom)
    //                 .attr('fill', 'grey')

});