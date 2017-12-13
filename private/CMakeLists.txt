cmake_minimum_required(VERSION 3.9)
project(codility)

set(CMAKE_CXX_STANDARD 14)

include_directories(
    .
)

set(SOURCE_FILES main.cpp)
add_executable(codility ${SOURCE_FILES})