package com.example.youtubelockman.payload;

import lombok.Data;
import java.time.LocalTime;

@Data
public class TimeRestrictionRequest {
    private Long categoryId;
    private Integer dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
}
