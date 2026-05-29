package ch.skitouren.config;

import org.hibernate.boot.model.FunctionContributions;
import org.hibernate.boot.model.FunctionContributor;
import org.hibernate.type.StandardBasicTypes;

public class TsFunctionContributor implements FunctionContributor {

    @Override
    public void contributeFunctions(FunctionContributions fc) {
        fc.getFunctionRegistry().registerPattern(
                "tsmatches",
                "(?1 @@ plainto_tsquery('german', ?2))",
                fc.getTypeConfiguration()
                  .getBasicTypeRegistry()
                  .resolve(StandardBasicTypes.BOOLEAN)
        );
    }
}
