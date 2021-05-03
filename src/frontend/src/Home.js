import React, {useState, useEffect} from "react";
import {useHistory} from "react-router-dom";
import {GridList,Typography} from '@material-ui/core'
import GridListTile from '@material-ui/core/GridListTile'


const tileData = [
    {
        img: "https://www.pickardroofing.com/hubfs/Plastic-rain-gutter-1030178214_3869x2579.jpeg",
        title: 'Example1',
        author: 'author',
        cols: 1
    },
    {
        img: "https://www.johnmcclungroofing.com/wp-content/uploads/sites/7534/2018/06/copper-gutters-1.jpg",
        title: 'Example2',
        author: 'author',
        cols: 2
    },
    {
        img: "https://www.plygem.com/wp-content/uploads/2018/09/gutters_beauty-1.jpg",
        title: 'Example1',
        author: 'author',
        cols: 3
    },
    {
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNxO9pZ2fXVNQHArn4wno3Re9x_yfLK311rQ&usqp=CAU",
        title: 'Example1',
        author: 'author',
        cols: 1.5
    },
    {
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXjXj1W14tKAXzOl_7yStMSTwumT3sde3c7A&usqp=CAU",
        title: 'Example1',
        author: 'author',
        cols: 1.5
    },
]

function Home(){
    const [error, setError] = useState(null);
    // const [clientQuery, setCQuery] = useState([]);
    let history = useHistory();
    const submitEstimate = async ()=> {
        console.log("Submitted the form")
    }
    
    useEffect(()=>{
        // history.push("/admin");
        // queryClient();
    },[]);

    return (
        <div >
            {history.push("/")}
            <h1> Welcome! Get a fast online quote with our pre-estimate form! </h1>
            <GridList cellHeight={150}  cols={3} style={{ width: '80vw' }}>
            {tileData.map((tile) => (
                <GridListTile key={tile.img} cols={tile.cols || 1}>
                <img src={tile.img} alt={tile.title} />
                </GridListTile>
            ))}
            </GridList>
        </div>
    )

};

export default Home;