package com.msis.app.domain.exception;

import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@Data
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class EntityDuplicationException extends RuntimeException {
    private String entityName;
    private String fieldName;
    private Object fieldValue;

    public EntityDuplicationException(String entityName, String fieldName, Object fieldValue) {
        super(String.format("Cannot save %s. Duplication field %s: %s.", entityName, fieldName, fieldValue));
        this.entityName = entityName;
        this.fieldName = fieldName;
        this.fieldValue = fieldValue;
    }
}
