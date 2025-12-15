"use client";
import {useState,useRef} from "react";
import DynamicPost from "@/components/DynamicPost";

export default function Home() {
  const inputRef = useRef("");
  const searchPost = () =>{
    fetch(process.env.NEXT_PUBLIC_API_URL + "/posts?q=" + inputRef.current.value)
    .then((res) => res.json())

  }
  return (
    <>
      <main>
        <div className="my-5 p-5 text-center position-relative">
          <div
            className="blob bg-pink position-absolute"
            style={{ left: "220px", top: "3" }}
          ></div>
          <div
            className="blob bg-purple position-absolute"
            style={{ right: "220px", top: "3" }}
          ></div>
          <p className="display-5">Welcome to BlogSpace!!!</p>
          <p className="h2 text-muted">Post,Share,Trend</p>
          <br />
          <br />
          <br />
          <br />
          <br />
          
          <br/>
          <h1 className="mt-3">Sample picks of blogs </h1>
          <div className="row">
            <div className="my-5 col-12 col-md-6 col-lg-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <img src="/images/pycharm.png" className="card-img-top" />
                </div>
                <div className="card-title">
                  <h6>PYCHARM</h6>
                </div>
                <br />
                <div className="p-3 card-text text-justify">
                  We’re excited to announce that PyCharm 2025.3 is here! This
                  release continues our mission to make PyCharm the most
                  powerful Python IDE for web, data, and AI/ML development. 
                  
                </div>
                <div className="card-footer text-muted"></div>
              </div>
            </div>

            <div className="my-5 col-12 col-md-6 col-lg-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <img src="/images/food.png" className="card-img-top" />
                </div>
                <div className="card-title">
                  <h6>Basic Sabzee (Curried Vegetables)</h6>
                </div>
                <br />
                <div className="p-3 card-text text-justify">
                  This recipe is the foundation for making a gravy-based sabzee
                  with the vegetable of your choice. For best flavor, grind your
                  own spices with an electric coffee grinder or mortar and
                  pestle.
                </div>
                <div className="card-footer text-muted"></div>
              </div>
            </div>

            <div className="my-5 col-12 col-md-6 col-lg-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <img src="/images/food1.png" className="card-img-top" />
                </div>
                <div className="card-title">
                  <h6>Mango Lassi</h6>
                </div>
                <br />
                <div className="p-3 card-text text-justify">
                  Mango Lassi is a delicious, cooling, and refreshing beverage
                  that can help correct liver and menstrual disorders, as well
                  as poor eyesight.
                </div>
                <div className="card-footer text-muted"></div>
              </div>
            </div>

            <div className="my-5 col-12 col-md-6 col-lg-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <img src="/images/bird.png" className="card-img-top" />
                </div>
                <div className="card-title">
                  <h6>Bird Watching Tips for Indian Birdwatchers</h6>
                </div>
                <br />
                <div className="p-3 card-text text-justify">
                  Welcome, passionate birdwatchers, to our ultimate guide on
                  Bird Watching Tips 2023. Whether you’re an experienced birder
                  or a beginner taking your first […]
                </div>
                <div className="card-footer text-muted"></div>
              </div>
            </div>

            <div className="my-5 col-md-6 col-lg-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <img src="/images/verge.png" className="card-img-top" />
                </div>
                <div className="card-title">
                  <h6>Technology, science, entertainment</h6>
                </div>
                <br />
                <div className="p-3 card-text text-justify">
                  The Verge is a blog focused on examining how technology will
                  change the future. This blog provides news and opinion pieces
                  on the latest technological..
                </div>
                <div className="card-footer text-muted"></div>
              </div>
            </div>

            <div className="my-5 col-md-6 col-lg-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <img src="/images/engadget.png" className="card-img-top" />
                </div>
                <div className="card-title">
                  <h6>Technology, gadgets, consumer electronics</h6>
                </div>
                <br />
                <div className="p-3 card-text text-justify">
                  Launched by Peter Rojas, Engadget is a technology blog
                  providing reviews of gadgets and consumer electronics as well
                  as the latest news in the tech. 
                </div>
                <div className="card-footer text-muted"></div>
              </div>
            </div>
            <br/>
            <hr className="mt-5"/>
            <br/>
            <h1 className="mt-4 mb-5">Recent Blogs</h1>
            <DynamicPost />
          </div>
        </div>
      </main>
      <div className="my-5 p-5"></div>
    </>
  );
}
