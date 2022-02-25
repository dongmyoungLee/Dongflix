import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { useHistory } from "react-router-dom";
import { useInfiniteQuery } from "react-query";
import { getTopRatedMovies, DEFAULT_IMG } from "../../api";
import { IGetMoviesResult } from "../../api";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { makeImagePath } from "../../utilities";
import {
  faChevronLeft,
  faChevronRight,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

const Wrapper = styled.div`
  background: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Slider = styled.div`
  position: relative;
  top: -5.3rem;
  margin-bottom: 15rem;
`;

const SliderTitle = styled.div`
  margin-bottom: 2rem;
  margin-left: 4rem;
  font-size: 1.5rem;
`;

const Prev = styled(motion.div)`
  height: 80%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.3;
  position: absolute;
  z-index: 10;
  left: 1rem;
  top: 7rem;
`;

const Next = styled(motion.div)`
  height: 80%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.3;
  position: absolute;
  right: 1rem;
  top: 7rem;
  background-color: rgba(0, 0, 0, 1);
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 0.2rem;
  grid-template-columns: repeat(6, 1fr);
  width: 100%;
  position: absolute;
  padding: 0 4rem;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const MovieImg = styled(motion.img)`
  border-radius: 0.5rem;
  width: 100%;
`;

const Info = styled(motion.div)`
  background-color: ${(props) => props.theme.black.darker};
  opacity: 0;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0px 2px 25px rgba(0, 0, 0, 0.5);
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  padding: 1rem;
`;

const MovieTitle = styled.div``;

const MovieVote = styled.div`
  width: 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BoxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "tween",
    },
  },
};

const RowVariants = {
  hidden: (back: boolean) => ({
    x: back ? -window.outerWidth + 5 : window.innerWidth,
  }),
  visible: { x: 0 },
  exit: (back: boolean) => ({
    x: back ? window.innerWidth : -window.innerWidth,
  }),
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.3,
      duration: 0.1,
      type: "tween",
    },
  },
};

const movieImgVariants = {
  hover: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    transition: {
      delay: 0.3,
      duration: 0.2,
      type: "tween",
    },
  },
};

const offset = 6;

function TopMovie() {
  const history = useHistory();
  const {
    data: topData,
    isLoading: topIsLoading,
    hasNextPage: topHasNextPage,
    fetchNextPage: topHasfecthNextPage,
  } = useInfiniteQuery<IGetMoviesResult>(
    ["movies", "top_rated"],
    getTopRatedMovies,
    {
      getNextPageParam: (currentPage) => {
        const nextPage = currentPage.page + 1;
        return nextPage > currentPage.total_pages ? null : nextPage;
      },
    }
  );

  const [topIndex, setTopIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [back, setBack] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const increaseTopIndex = () => {
    if (topData) {
      if (leaving) return;
      setBack(false);
      toggleLeaving();
      const totalMovie =
        topData.pages.map((page) => page.results).flat().length - 1;
      const maxIndex = Math.floor(totalMovie / offset) - 1;
      setTopIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const decreaseTopIndex = () => {
    if (topData) {
      if (leaving) return;
      setBack(true);
      toggleLeaving();
      const totalMovie =
        topData.pages.map((page) => page.results).flat().length - 1;
      const maxIndex = Math.floor(totalMovie / offset) - 1;
      setTopIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };

  const onClickedBox = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };

  return (
    <Wrapper>
      {topIsLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Slider>
            <SliderTitle>평점 높은 순</SliderTitle>
            <Prev whileHover={{ opacity: 1 }} onClick={decreaseTopIndex}>
              <FontAwesomeIcon
                icon={faChevronLeft}
                size="2x"
                style={{
                  position: "relative",
                  bottom: "-5rem",
                }}
              />
            </Prev>
            <AnimatePresence
              custom={back}
              onExitComplete={toggleLeaving}
              initial={false}
            >
              <Row
                custom={back}
                variants={RowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={topIndex}
              >
                {topData?.pages
                  .map((page) => page.results)
                  .flat()
                  .slice(offset * topIndex, offset * topIndex + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ""}
                      key={movie.id}
                      variants={BoxVariants}
                      whileHover="hover"
                      initial="normal"
                      transition={{ type: "tween" }}
                      onClick={() => onClickedBox(movie.id)}
                      bgphoto={makeImagePath(movie.poster_path, "w500")}
                    >
                      <MovieImg
                        variants={movieImgVariants}
                        src={
                          movie.poster_path
                            ? makeImagePath(movie.poster_path, "w500")
                            : DEFAULT_IMG
                        }
                      />

                      <Info variants={infoVariants}>
                        <MovieTitle>{movie.title}</MovieTitle>
                        <MovieVote>
                          <FontAwesomeIcon
                            icon={faStar}
                            size="xs"
                            color="orange"
                          />
                          <div>{movie.vote_average}</div>
                        </MovieVote>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <Next whileHover={{ opacity: 1 }} onClick={increaseTopIndex}>
              <FontAwesomeIcon
                icon={faChevronRight}
                size="2x"
                style={{
                  position: "relative",
                  bottom: "-5rem",
                }}
              />
            </Next>
          </Slider>
        </>
      )}
    </Wrapper>
  );
}

export default TopMovie;
