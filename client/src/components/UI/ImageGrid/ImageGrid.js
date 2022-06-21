import React from "react";
import { makeStyles } from "@mui/styles";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material//ImageListItem";
import ImageListItemBar from "@mui/material//ImageListItemBar";
import "./ImageGrid.css";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
  },

  titleBar: {
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
      "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
  },
  icon: {
    color: "white",
  },
}));

const ImageGrid = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ImageList rowHeight={200} gap={1} className="image-list">
        {props.data.map((item, i) => (
          <Link to={`${props.imagesPath}${item.alias}`} key={i}>
            <ImageListItem cols={1} rows={1} className="column-3">
              <img src={item.img} alt={item.title} />
              <ImageListItemBar
                title={item.title}
                position="top"
                actionPosition="left"
                className={classes.titleBar}
              />
            </ImageListItem>
          </Link>
        ))}
      </ImageList>
    </div>
  );
};

export default ImageGrid;
